import jwt
from ninja import NinjaAPI, Router
from user.api import create_token, router as user_router 
from transfer.api import router as transfer_router
from card.api import router as card_router
from dashboard.api import router as dashboard_router
from ninja.security import HttpBearer, django_auth
from django.conf import settings
from ninja.errors import HttpError
from django.shortcuts import get_object_or_404
from user.models import UserModel
from user.schemas import LoginSchema, MessageSchema, MessageSchema, ResponseUserSchema, TokenSchema, UserSchema
from django.forms import model_to_dict
class AuthBearer(HttpBearer):
    def authenticate(self, request, token):
        try:
            payload = jwt.decode(token, settings.JWT_SECRET , algorithms=[settings.JWT_ALGORITHM])
            user = UserModel.objects.get(id=payload['id'])
            return user
        except jwt.ExpiredSignatureError:
            return None
        except (jwt.InvalidTokenError, UserModel.DoesNotExist):
            return None
api = NinjaAPI(auth=[AuthBearer()] , version="1.0.0", urls_namespace="apifinancas")
public_router = Router(auth=None)
@public_router.post('/', response={200: TokenSchema, 400: MessageSchema, 404:MessageSchema} )
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

@public_router.post('add/', response={200: ResponseUserSchema, 400: MessageSchema, 500:MessageSchema})
def postUser(request, u:UserSchema):
    try:
        nu = u.dict()
        try:
            user = UserModel.objects.get(username = nu['username'])
            return 400, {"message": "O username ja existe!"}
        except UserModel.DoesNotExist:
            newUser = UserModel(**nu)
            newUser.encrypassword()
            newUser.save()
            return 200, model_to_dict(newUser, fields=['id', 'name', 'username', 'email', 'valorGasto'])
    except Exception as ex:
        return 500, {"message": f"Houve algum erro em salvar o usuario {ex}"}

api.add_router("/auth/", public_router)
api.add_router("/user/", user_router)
api.add_router("/transfer/", transfer_router)
api.add_router("/card/", card_router)
api.add_router("/dashboard/", dashboard_router)
