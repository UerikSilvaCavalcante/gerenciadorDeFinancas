from ninja import ModelSchema, Schema
from decimal import Decimal


class PltsMesSchema(Schema):
    day: int
    act_mounth: Decimal
    past_mounth: Decimal

class ResponseGastosSchema(Schema):
    categoria: str
    gasto: Decimal


class ResponseTransfersSchema(Schema):
    id: int
    value: Decimal
    date: str
    type_transfer: str