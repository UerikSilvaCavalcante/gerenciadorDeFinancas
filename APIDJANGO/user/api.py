from decimal import Decimal
from django.forms import model_to_dict
import jwt
from ninja import Router

from transfer.models import Transfer
from .models import UserModel
from django.shortcuts import get_object_or_404, get_list_or_404
from .schemas import (
    UserSchema,
    ResponseUserSchema,
    MessageSchema,
)
from typing import List
from datetime import datetime, timedelta
from django.conf import settings

router = Router()


@router.get("list/", response=List[ResponseUserSchema])
def getUser(request):
    users = get_list_or_404(UserModel)
    d_users = [model_to_dict(user) for user in users]
    return d_users


@router.get("{int:id}", response={200: ResponseUserSchema, 404: MessageSchema, 500: MessageSchema})
def getUserById(request, id: int):
    try:
        user = get_object_or_404(UserModel, id=id)
        transfers = Transfer.objects.filter(user_id=id, date__month=datetime.now().month)
        valorTot = sum(Decimal(transfer.value) for transfer in transfers)
        user.valorGasto = valorTot
        return 200, model_to_dict(user)
    except UserModel.DoesNotExist:
        return 404, {"message": "Usuario nao encontrado!"}
    except Exception as ex:
        return 500, {"message": f"Erro ao buscar usuario Erro:{ex}"}

def create_token(user):
    exp = datetime.now() + timedelta(seconds=settings.JWT_EXP_DELTA_SECONDS)
    payload = {
        "id": user.id,
        "exp": int(exp.timestamp()),
    }
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token


@router.put("{int:id}", response={206: MessageSchema, 404: MessageSchema, 500: MessageSchema})
def putUser(request, id: int, u: UserSchema):
    try:
        nu = u.dict()
        user = UserModel.objects.get(id=id)
        user.name = nu["name"]
        user.username = nu["username"]
        user.email = nu["email"]
        user.save()
        user.refresh_from_db()
        return 206, {"message": "Usuario alterado com sucesso!"}
    except UserModel.DoesNotExist:
        return 404, {"message": "Usuario nao encontrado!"}
    except Exception as ex:
        return 500, {"message": f"Erro ao alterar usuario Erro:{ex}"}



@router.delete("{int:id}", response={200: MessageSchema, 404: MessageSchema,500: MessageSchema})
def deleteUser(request, id: int):
    try:
        user = UserModel.objects.get(id=id)
        user.delete()
        user.refresh_from_db()
        return 200, {"message": "Usuario deletado com sucesso!"}
    except UserModel.DoesNotExist:
        return 404, {"message": "Usuario nao encontrado!"}
    except Exception as ex:
        return 500, {"message": f"Erro ao deletar usuario Erro:{ex}"}


