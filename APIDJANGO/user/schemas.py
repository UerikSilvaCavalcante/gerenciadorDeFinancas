from ninja import ModelSchema, Schema

from user.models import UserModel

class UserSchema(ModelSchema):
    class Config:
        model = UserModel
        model_fields = ['name', 'username','password', 'email', 'valorGasto']

class ResponseUserSchema(ModelSchema):
    class Config:
        model = UserModel
        model_fields = ['id', 'name', 'username', 'email', 'valorGasto']
    

class PasswordSchema(Schema):
    password: str

class LoginSchema(Schema):
    username:str
    password:str