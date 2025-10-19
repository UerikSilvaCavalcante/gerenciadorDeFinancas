from django.forms import model_to_dict
from ninja import Router
from decimal import Decimal
from ninja.errors import HttpError
from user.models import UserModel
from card.models import CardModel
from .models import Transfer
from .schemas import (
    ResponseListStatic,
    TransferSchema,
    ResponseTransferSchema,
    ResponseListTransferSchema,
)
from user.schemas import MessageSchema
from typing import List
from django.shortcuts import get_object_or_404, get_list_or_404
from django.utils import timezone


router = Router()


@router.get(
    "list/{int:id}",
    response={200: List[ResponseListTransferSchema], 404: MessageSchema},
)
def getall_transfers(request, id: int):
    try:
        g_transfers = get_list_or_404(Transfer, user_id=id)
        for transfer in g_transfers:
            transfer.date = transfer.date.strftime("%Y-%m-%d %H:%M:%S")
        d_transfers = []
        for transfer in g_transfers:
            t = model_to_dict(
                transfer,
                fields=[
                    "id",
                    "value",
                    "date",
                    "type_transfer",
                    "payment_method",
                    "description",
                    "card_id",
                ],
            )

            t["payment_method"] = transfer.get_payment_method_display()
            if transfer.card_id:
                t["payment_method"] = f"{t['payment_method']}: {str(transfer.card_id)}"
            d_transfers.append(t)

        months = [d_transfers["date"].split("-")[1] for d_transfers in d_transfers]
        months = list(set(months))
        months.sort(reverse=True)
        d_transfers = [
            {
                **transfer,
                "card_id": (
                    str(g_transfers[n].card_id) if g_transfers[n].card_id else None
                ),
            }
            for n, transfer in enumerate(d_transfers)
        ]
        reponse = []

        for month in months:
            days = [
                transfer["date"]
                for transfer in d_transfers
                if transfer["date"].split("-")[1] == month
            ]
            days = list(set(days))
            days.sort(reverse=True)
            transfers = []
            for day in days:
                transfers.append(
                    {
                        "day": day,
                        "valueTot": sum(
                            transfer["value"]
                            for transfer in d_transfers
                            if transfer["date"] == day
                        ),
                        "transfers": [
                            {
                                "id": transfer["id"],
                                "value": transfer["value"],
                                "desc": transfer["description"],
                                "payment_method": transfer["payment_method"],
                                "type_transfer": transfer["type_transfer"],
                            }
                            for transfer in d_transfers
                            if transfer["date"] == day
                        ],
                    }
                )
            reponse.append({"mounth": month, "days": transfers})

        return reponse
    except Exception as e:
        return 404, {
            "message": f"Transfers not found for user with id {id}. Error: {str(e)}"
        }


@router.get(
    "detail/{int:id}",
    response={200: ResponseTransferSchema, 404: MessageSchema, 500: MessageSchema},
)
def get_transfer(request, id: int):
    try:
        transfer = get_object_or_404(Transfer, id=id)
        transfer.date = transfer.date.strftime("%Y-%m-%d")
        d_transfer = model_to_dict(transfer)
        d_transfer["card_id"] = transfer.card_id.id if transfer.card_id else None
        d_transfer["description"] = transfer.description if transfer.description else ""
        return 200, d_transfer
    except Transfer.DoesNotExist:
        return 404, {"message": f"Transfer with id {id} not found."}
    except Exception as e:
        return 500, {"message": f"Error getting transfer with id {id}. Error: {str(e)}"}


@router.post(
    "add",
    response={201: MessageSchema, 404: MessageSchema, 500: MessageSchema, 400: MessageSchema},
)
def add_transfer(request, transfer: TransferSchema):
    try:
        d_transfer = transfer.dict()
        user = UserModel.objects.get(id=d_transfer["user_id"])

        card = (
            CardModel.objects.get(id=d_transfer["card_id"])
            if d_transfer["card_id"]
            else None
        )
        if d_transfer["payment_method"] in [1, 3] and (card.type_card == 2):
            return 400, {
                "message": f"Esse Tipo de Cartão não e aceito para o metodo de pagamento"
            }
        if d_transfer["payment_method"] in [2] and (card.type_card == 1):
            return 400, {
                "message": f"Esse Tipo de Cartão não e aceito para o metodo de pagamento"
            }

        d_transfer["card_id"] = card
        d_transfer["user_id"] = user
        tr = Transfer(**d_transfer)
        tr.save()
        user.save()
        tr.refresh_from_db()
        user.refresh_from_db()
        return 201, {"message": "Transfer adicionada com sucesso."}
    except UserModel.DoesNotExist:
        return 404, {"message": f"Usuario não encontrado."}
    except CardModel.DoesNotExist:
        return 404, {"message": f"Cartão não encontrado."}
    except Exception as e:
        return 500, {"message": f"Erro ao adicionar transferencia: {str(e)}"}


@router.put(
    "{int:id}",
    response={
        200: MessageSchema,
        404: MessageSchema,
        500: MessageSchema,
        400: MessageSchema,
    },
)
def update_transfer(request, id: int, transfer: TransferSchema):
    try:
        db_transfer = get_object_or_404(Transfer, id=id)
        user = UserModel.objects.get(id=transfer.user_id)

        d_transfer = transfer.dict()
        if d_transfer["card_id"]:
            card = CardModel.objects.get(id=d_transfer["card_id"])
            if d_transfer["payment_method"] in [1] and (
                card.type_card != 1 or card.type_card != 3
            ):
                return 400, {
                    "message": f"Esse Tipo de Cartão não e aceito para o metodo de pagamento"
                }
            elif d_transfer["payment_method"] in [2] and card.type_card == 1:
                return 400, {
                    "message": f"Esse Tipo de Cartão nao e aceito para o metodo de pagamento"
                }
            d_transfer["card_id"] = card
        else:
            d_transfer["card_id"] = None
        db_transfer.user_id = user
        db_transfer.value = d_transfer["value"]
        db_transfer.description = d_transfer["description"]
        db_transfer.type_transfer = d_transfer["type_transfer"]
        db_transfer.payment_method = d_transfer["payment_method"]
        db_transfer.card_id = d_transfer["card_id"]
        db_transfer.date = d_transfer["date"]
        db_transfer.save()
        user.save()
        db_transfer.refresh_from_db()
        d_transfer = model_to_dict(
            db_transfer,
            fields=[
                "id",
                "user_id",
                "value",
                "description",
                "type_transfer",
                "payment_method",
                "card_id",
                "date",
            ],
        )
        d_transfer["payment_method"] = db_transfer.get_payment_method_display()
        d_transfer["card_id"] = (
            str(db_transfer.card_id) if db_transfer.card_id else None
        )
        d_transfer["date"] = db_transfer.date.strftime("%Y-%m-%d")
        return 200, d_transfer
    except Transfer.DoesNotExist:
        return 404, {"message": f"Gasto não encontrado."}
    except UserModel.DoesNotExist:
        return 404, {"message": f"Usuario não encotrado."}
    except CardModel.DoesNotExist:
        return 404, {"message": f"Cartão não encotrado."}
    except Exception as e:
        return 500, {"message": f"Erro ao atualizar transferencia Error: {str(e)}"}


@router.delete("{int:id}/", response={200: MessageSchema, 404: MessageSchema})
def delete_transfer(request, id: int):
    try:
        db_transfer = get_object_or_404(Transfer, id=id)
        user = UserModel.objects.get(id=db_transfer.user_id.id)
        user.valorGasto = Decimal(user.valorGasto) - Decimal(db_transfer.value)
        user.save()
        db_transfer.delete()
        return 200, {"message": f"Gasto deletado com sucesso."}

    except UserModel.DoesNotExist:
        return 404, {"message": f"Usuario não encotrado."}
    except CardModel.DoesNotExist:
        return 404, {"message": f"Cartão não encotrado."}
    except Transfer.DoesNotExist:
        return 404, {"message": f"Gasto nao encontrado."}
    except Exception as e:
        return 500, {"message": f"Erro ao deletar transferencia: {str(e)}"}
