from ninja import ModelSchema, Schema
from decimal import Decimal


class PltsMesSchema(Schema):
    mes: int
    eixoX: list[int]
    eixoY: list[Decimal]

class ResponseMesSchema(Schema):
    mes_atual: PltsMesSchema
    mes_passado: PltsMesSchema

class ResponseGastosSchema(Schema):
    eixoX: list[str]
    eixoY: list[Decimal]
    total: float


class ResponseTransfersSchema(Schema):
    id: int
    value: Decimal
    date: str
    type_transfer: str