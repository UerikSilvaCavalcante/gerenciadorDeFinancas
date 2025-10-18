from ninja import Schema

class CodeSchema(Schema):
    email: str
    code: str

class GetCodeSchema(Schema):
    email: str

class PasswordSchema(Schema):
    email:str
    password: str