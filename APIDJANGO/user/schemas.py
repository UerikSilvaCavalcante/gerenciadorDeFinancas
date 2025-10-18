from ninja import ModelSchema, Schema

from user.models import UserModel

class UserSchema(ModelSchema):
    class Config:
        model = UserModel
        model_fields = ['name', 'username', 'email']

class ResponseUserSchema(ModelSchema):
    class Config:
        model = UserModel
        model_fields = ['id', 'name', 'username', 'email', 'valorGasto']
    



class LoginSchema(Schema):
    username:str
    password:str

class TokenSchema(Schema):
    access_token: str
    token_type: str = 'bearer'

class MessageSchema(Schema):
    message: str