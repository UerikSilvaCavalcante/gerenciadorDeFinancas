from decimal import Decimal
from django.forms import model_to_dict
import jwt
from ninja import Router, ModelSchema, Schema

from transfer.models import Transfer 
from .models import UserModel
from ninja.errors import HttpError
from django.shortcuts import get_object_or_404, get_list_or_404
from .schemas import LoginSchema, UserSchema, ResponseUserSchema, PasswordSchema, TokenSchema, MessageSchema
from typing import List
from datetime import datetime, timedelta
from django.conf import settings
import pandas as pd
router = Router()



@router.get('list/', response=List[ResponseUserSchema])
def getUser(request):
    users = get_list_or_404(UserModel)
    d_users = [model_to_dict(user) for user in users]
    return d_users


@router.get('{int:id}', response=ResponseUserSchema)
def getUserById(request, id:int):
    user = get_object_or_404(UserModel, id = id)
    transfers = Transfer.objects.filter(user_id=id, date__month=datetime.now().month)
    valorTot = sum(Decimal(transfer.value) for transfer in transfers)
    user.valorGasto = valorTot
    return model_to_dict(user)


def create_token(user):
    exp = datetime.now() + timedelta(seconds=settings.JWT_EXP_DELTA_SECONDS)
    payload = {
        'id': user.id,
        'exp': int(exp.timestamp()),
    }
    token  = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token

@router.put('{int:id}', response={200:ResponseUserSchema, 404:MessageSchema})
def putUser(request, id:int,u:UserSchema):
    try:
        nu = u.dict()
        user = UserModel.objects.get(id=id)
        user.name = nu['name']
        user.username = nu['username']
        user.email = nu['email']
        user.save()
        user.refresh_from_db()
        return user
    except UserModel.DoesNotExist:
        return 404, {"message": "Usuario nao encontrado!"}



@router.delete('{int:id}', response={200:bool, 500:MessageSchema})
def deleteUser(request, id:int):
    try:
        user = UserModel.objects.get(id=id)
        user.delete()
        return True
    except Exception as ex:
        return 500, {"message": f"Erro ao deletar usuario Erro:{ex}"}
    


@router.post('login/', response={201: TokenSchema, 403: MessageSchema, 400:MessageSchema} )
def loginUser(request, l:LoginSchema):
    lo = l.dict()
    try:
        user= get_object_or_404(UserModel, username=lo['username'])
        validate = user.validate_password(lo['password'])
        if validate:
            token = create_token(user)
            return 200 ,{'access_token': token}

        else:
            return 403, {"message": "Senha incorreta!"}
    except UserModel.DoesNotExist:
        return 404, {"message": "Usuario nao encontrado!"}
    

@router.post('password/{int:id}', response={200: ResponseUserSchema, 404: MessageSchema, 500: MessageSchema}  )
def changePassword(request, id:int,password:PasswordSchema  ):
    try:
        user = UserModel.objects.get(id=id)
        user.password = password.password
        user.encrypassword()
        user.save()
        user.refresh_from_db()
        return model_to_dict(user, fields=['id', 'name', 'username', 'email', 'valorGasto'])
    except UserModel.DoesNotExist:
        return 404, {"message": "Usuario nao encontrado!"}
    except Exception as ex:
        return 500, {"message": f"Erro ao alterar senha: {ex}"}