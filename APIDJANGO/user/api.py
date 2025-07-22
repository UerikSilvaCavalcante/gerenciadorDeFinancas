from django.forms import model_to_dict
from ninja import Router, ModelSchema, Schema 
from .models import UserModel
from ninja.errors import HttpError
from django.shortcuts import get_object_or_404, get_list_or_404
from .schemas import LoginSchema, UserSchema, ResponseUserSchema, PasswordSchema
from typing import List



router = Router()



@router.get('list/', response=List[ResponseUserSchema])
def getUser(request):
    users = get_list_or_404(UserModel)
    d_users = [model_to_dict(user) for user in users]
    return d_users


@router.get('{int:id}', response=ResponseUserSchema)
def getUserById(request, id:int):
    user = get_object_or_404(UserModel, id = id)
    return model_to_dict(user)

@router.post('add/', response=ResponseUserSchema)
def postUser(request, u:UserSchema):
    try:
        nu = u.dict()
        try:
            UserModel.objects.get(username = nu['username'])
            raise HttpError(500, f'O usuario ja existe!')
        except UserModel.DoesNotExist:
            newUser = UserModel(**nu)
            newUser.encrypassword()
            newUser.save()
            return newUser
    except Exception as ex:
        raise HttpError(500, f'Houve algum erro em salvar o usuario {ex}')

@router.put('{int:id}', response=ResponseUserSchema)
def putUser(request, id:int,u:UserSchema):
    try:
        nu = u.dict()
        user = UserModel.objects.get(id=id)
        user.name = nu['name']
        user.username = nu['username']
        user.email = nu['email']
        user.valorGasto = nu['valorGasto']
        user.save()
        user.refresh_from_db()
        return user
    except UserModel.DoesNotExist:
        raise HttpError(404, "Usario não encotrado!")



@router.delete('{int:id}')
def deleteUser(request, id:int):
    try:
        user = UserModel.objects.get(id=id)
        user.delete()
        return True
    except Exception as ex:
        return HttpError(500, f"Erro ao deletar usuario Erro:{ex}")
    


@router.post('login/', response=ResponseUserSchema )
def loginUser(request, l:LoginSchema):
    lo = l.dict()
    user= get_object_or_404(UserModel, username=lo['username'])
    validate = user.validate_password(lo['password'])
    if validate:
        return model_to_dict(user)
    else:
        raise HttpError(403, "Senha ou usuario incorretas!")

@router.post('password/{int:id}', response=ResponseUserSchema  )
def changePassword(request, id:int,password:PasswordSchema  ):
    try:
        user = UserModel.objects.get(id=id)
        user.password = password.password
        user.encrypassword()
        user.save()
        user.refresh_from_db()
        return model_to_dict(user, fields=['id', 'name', 'username', 'email', 'valorGasto'])
    except UserModel.DoesNotExist:
        raise HttpError(404, "Usuario não encontrado!")
    except Exception as ex:
        raise HttpError(500, f"Erro ao alterar senha: {ex}")