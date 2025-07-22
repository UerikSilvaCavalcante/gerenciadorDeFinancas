from django.forms import model_to_dict
from ninja import Router
from decimal import Decimal
from ninja.errors import HttpError
from user.models import UserModel
from card.models import CardModel
from .models import Transfer
from .schemas import TransferSchema, ResponseTransferSchema, ResponseListTransferSchema
from typing import List
from django.shortcuts import get_object_or_404, get_list_or_404
from django.utils import timezone


router = Router()
@router.get('list/{int:id}', response=List[ResponseListTransferSchema])
def getall_transfers(request, id:int):
    try: 
        transfers = get_list_or_404(Transfer, user_id=id)
        for transfer in transfers:
            transfer.date = transfer.date.strftime('%Y-%m-%d %H:%M:%S')
        d_transfers = [model_to_dict(transfer) for transfer in transfers]
        months = [d_transfers['date'].split('-')[1] for d_transfers in d_transfers]
        months = list(set(months))
        d_transfers = [{
            **transfer,
            'card_id': str(transfers[n].card_id) if transfers[n].card_id else None
        } for n, transfer in enumerate(d_transfers)]
        
        response = [
            {
                'month': month,
                'transfers': [transfer for transfer in d_transfers if transfer['date'].split('-')[1] == month]
            } for month in months
        ]
        return response
    except Exception as e:
        raise HttpError(404, f"Transfers not found for user with id {id}. Error: {str(e)}")

@router.get('detail/{int:id}', response=ResponseTransferSchema)
def get_transfer(request, id:int):
    try:
        transfer = get_object_or_404(Transfer, id=id)
        transfer.date = transfer.date.strftime('%Y-%m-%d %H:%M:%S')
        d_transfer = model_to_dict(transfer)
        d_transfer['card_id'] = str(transfer.card_id) if transfer.card_id else None
        print(d_transfer['card_id'])
        return d_transfer        
    except Transfer.DoesNotExist:
        raise HttpError(404, f"Transfer with id {id} not found.")

@router.post('add/')
def add_transfer(request, transfer: TransferSchema):
    try:
        d_transfer = transfer.dict()
        user = UserModel.objects.get(id=d_transfer['user_id'])  
        user.valorGasto = Decimal(user.valorGasto) + Decimal(d_transfer['value'])
        card = CardModel.objects.get(id=d_transfer['card_id']) if d_transfer['card_id'] else None   
        if card:
            d_transfer['card_id'] = card
        d_transfer['user_id'] = user
        tr = Transfer(**d_transfer)
        tr.save()
        user.save()
        tr.refresh_from_db()
        user.refresh_from_db()
        return model_to_dict(tr, fields = ['user_id', 'value', 'description', 'type_transfer', 'payment_method', 'date'])
    except UserModel.DoesNotExist:
        raise HttpError(404, f"User with id {d_transfer['user_id']} not found.")
    except CardModel.DoesNotExist:
        raise HttpError(404, f"Card with id {d_transfer['card_id']} not found.")    

@router.put('{int:id}')
def update_transfer(request, id: int, transfer: TransferSchema):
    try:
        db_transfer = get_object_or_404(Transfer, id=id)
        user = UserModel.objects.get(id=transfer.user_id)
        user.valorGasto  = (Decimal(user.valorGasto) - Decimal(db_transfer.value)) + Decimal(transfer.value)
        d_transfer = transfer.dict()
        if d_transfer['card_id']:
            card = CardModel.objects.get(id=d_transfer['card_id'])
            d_transfer['card_id'] = card
        else:
            d_transfer['card_id'] = None
        db_transfer.user_id = user
        db_transfer.value = d_transfer['value']
        db_transfer.description = d_transfer['description']
        db_transfer.type_transfer = d_transfer['type_transfer']
        db_transfer.payment_method = d_transfer['payment_method']
        db_transfer.card_id = d_transfer['card_id']
        db_transfer.date = d_transfer['date']
        db_transfer.save()
        user.save()
        db_transfer.refresh_from_db()
        return model_to_dict(db_transfer, fields=['id','user_id', 'value', 'description', 'type_transfer', 'payment_method', 'card_id', 'date'])
    except UserModel.DoesNotExist:
        raise HttpError(404, f"User with id {d_transfer['user_id']} not found.")
    except CardModel.DoesNotExist:
        raise HttpError(404, f"Card with id {d_transfer['card_id']} not found.")


@router.delete('{int:id}')
def delete_transfer(request, id: int):
    try:
        db_transfer = get_object_or_404(Transfer, id=id)
        user = UserModel.objects.get(id=db_transfer.user_id.id)
        user.valorGasto = Decimal(user.valorGasto) - Decimal(db_transfer.value)
        user.save()
        db_transfer.delete()    
        return {"success": True, "message": f"Transfer with id {id} deleted successfully."}
    except UserModel.DoesNotExist:
        raise HttpError(404, f"User with id {db_transfer.user_id.id} not found.")
    except CardModel.DoesNotExist:
        raise HttpError(404, f"Card with id {db_transfer.card_id.id} not found.")


