from django.forms import model_to_dict
from ninja import Router
from django.shortcuts import get_object_or_404, get_list_or_404
from ninja.errors import HttpError
from card.schemas import CardSchema, ResponseCardSchema, ResponseDetailSchema
from transfer.models import Transfer
from user.models import UserModel
from card.models import CardModel
from typing import List
from transfer.api import add_transfer

router = Router()

@router.get('list/{int:id}', response=List[ResponseCardSchema])
def get_all_cards(request, id: int):
    try:
        cards = get_list_or_404(CardModel, user_id=id)
        return [model_to_dict(card, fields=['id', 'brand', 'bank', 'type_card']) for card in cards]
    except Exception as e:
        raise HttpError(404, f"Cards not found for user with id {id}. Error: {str(e)}")

@router.get('detail/{int:id}', response=ResponseDetailSchema)
def get_card(request, id: int):
    try:
        card = get_object_or_404(CardModel, id = id)

        transfers = get_list_or_404(Transfer, card_id=id)
        for transfer in transfers:
            transfer.date = transfer.date.strftime('%Y-%m-%d %H:%M:%S')
        d_transfers = [model_to_dict(transfer) for transfer in transfers]
        d_transfers = [{
            **transfer,
            'card_id': str(transfers[n].card_id) if transfers[n].card_id else None
        } for n, transfer in enumerate(d_transfers)]
        value_tot = sum(transfer.value for transfer in transfers)
        return {"card": model_to_dict(card), "transfers": d_transfers, "total_value": value_tot}
    except Exception as e:
        raise HttpError(404, f"Transfers not found for card with id {id}. Error: {str(e)}")
    except CardModel.DoesNotExist:
        raise HttpError(404, f"Card with id {id} not found.")

@router.post('add/', response=ResponseCardSchema)
def add_card(request, card: CardSchema):
    try:
        d_card = card.dict()
        user = UserModel.objects.get(id=d_card['user'])
        d_card['user'] = user
        new_card = CardModel(**d_card)
        new_card.save()
        new_card.refresh_from_db()
        return model_to_dict(new_card)
    except UserModel.DoesNotExist:
        raise HttpError(404, f"User with id {d_card['user_id']} not found.")
    except Exception as e:
        raise HttpError(400, f"Error adding card: {e}")

@router.put('{int:id}', response=ResponseCardSchema)
def update_card(request, id: int, card: CardSchema):
    try:
        db_card = get_object_or_404(CardModel, id=id)
        d_card = card.dict()
        user = UserModel.objects.get(id=d_card['user'])
        d_card['user'] = user
        for attr, value in d_card.items():
            setattr(db_card, attr, value)       
        db_card.save()
        db_card.refresh_from_db()
        return model_to_dict(db_card)
    except CardModel.DoesNotExist:
        raise HttpError(404, f"Card with id {id} not found.")
    except Exception as e:
        raise HttpError(400, f"Error updating card: {str(e)}")


@router.delete('{int:id}')
def delete_card(request, id: int):
    try:
        card = get_object_or_404(CardModel, id=id)
        card.delete()
        return {"success": True, "message": f"Card with id {id} deleted successfully."}
    except CardModel.DoesNotExist:
        raise HttpError(404, f"Card with id {id} not found.")
    except Exception as e:
        raise HttpError(400, f"Error deleting card: {str(e)}")
