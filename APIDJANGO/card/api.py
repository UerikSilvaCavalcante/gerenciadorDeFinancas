from django.forms import model_to_dict
from ninja import Router
from django.shortcuts import get_object_or_404, get_list_or_404
from ninja.errors import HttpError
from card.schemas import CardSchema, ResponseCardSchema, ResponseDetailSchema
from transfer.models import Transfer
from user.models import UserModel
from card.models import CardModel
from typing import List
from transfer.api import add_transfer
from user.schemas import MessageSchema

router = Router()

@router.get('list/{int:id}', response={200: List[ResponseCardSchema], 404: MessageSchema})
def get_all_cards(request, id: int):
    try:
        cards = get_list_or_404(CardModel, user_id=id)
        response = []
        for card in cards:
            d = model_to_dict(card, fields=['id', 'user',  'bander', 'bank', 'type_card', 'color', 'limit'])
            d['type_card'] = card.get_type_card_display()
            response.append(d)
        return response
    except Exception as e:
        return  404, {"message": f"Cards not found for user with id {id}. Error: {str(e)}"}

@router.get('detail/{int:id}', response={200: ResponseDetailSchema, 404: MessageSchema})
def get_card(request, id: int):
    try:
        card = get_object_or_404(CardModel, id = id)
        limit = None

        g_transfers = Transfer.objects.filter(card_id=id)
        if card.type_card == 1 or card.type_card == 3:
            c_transfers = g_transfers.filter(payment_method=1)
            limit = sum([transfer.value for transfer in c_transfers])
        for transfer in g_transfers:
            transfer.date = transfer.date.strftime('%Y-%m-%d')
        d_transfers = []
        for transfer in g_transfers:
            t = model_to_dict(transfer, fields=['id', 'value', 'date', 'type_transfer', 'payment_method', 'description','card_id'])
            
            t['payment_method'] = transfer.get_payment_method_display();
            d_transfers.append(t)
        


        months = [d_transfers['date'].split('-')[1] for d_transfers in d_transfers]
        months = list(set(months))
        months.sort(reverse=True)
        
        reponse = []
        value_tot = 0
        for month in months:
            days = [transfer['date'] for transfer in d_transfers if transfer['date'].split('-')[1] == month]
            days = list(set(days))
            days.sort(reverse=True)
            transfers = []
            for day in days:
                transfers.append({
                    'day': day,
                    'valueTot': sum(transfer['value'] for transfer in d_transfers if transfer['date'] == day),
                    'transfers': [{'id': transfer['id'],
                                'value': transfer['value'], 
                                'desc': transfer['description'], 
                                'payment_method': transfer['payment_method'], 
                                'type_transfer': transfer['type_transfer']} for transfer in d_transfers if transfer['date'] == day]
                })
            reponse.append({
                'mounth': month,     
                'days': transfers
            })
        value_tot = sum(transfer.value for transfer in g_transfers)
        d_card = model_to_dict(card, fields=['id','user',  'bander', 'bank', 'type_card', 'color', 'limit'])
        d_card['type_card'] = card.get_type_card_display()
        
        return {"card":d_card, "transfers": reponse, "total_value": value_tot, "limit": limit}
    except Exception as e:
        return 404, {"message" : f"Transfers not found for card with id {id}. Error: {str(e)}"}
    except CardModel.DoesNotExist:
        return 404, {"message": f"Card with id {id} not found."}

@router.post('add', response=bool)
def add_card(request, card: CardSchema):
    try:
        d_card = card.dict()
        user = UserModel.objects.get(id=d_card['user'])
        d_card['user'] = user
        new_card = CardModel(**d_card)
        new_card.save()
        new_card.refresh_from_db()
        return True
    except UserModel.DoesNotExist:
        return  404, {"message": f"User with id {d_card['user']} not found."}
    except Exception as e:
        return  400, {"message": f"Error adding card: {e}"}

@router.put('{int:id}', response={200: ResponseCardSchema, 404: MessageSchema, 400: MessageSchema})
def update_card(request, id: int, card: CardSchema):
    try:
        db_card = get_object_or_404(CardModel, id=id)
        d_card = card.dict()
        user = UserModel.objects.get(id=d_card['user'])
        d_card['user'] = user
        for attr, value in d_card.items():
            setattr(db_card, attr, value)       
        db_card.save()
        db_card.refresh_from_db()
        dbd_card = model_to_dict(db_card)
        dbd_card['type_card'] = db_card.get_type_card_display()
        return dbd_card
    except CardModel.DoesNotExist:
        return 404, {"message": f"Card with id {id} not found."}
    except Exception as e:
        return 400, {"message": f"Error updating card: {str(e)}"}


@router.delete('{int:id}')
def delete_card(request, id: int):
    try:
        card = get_object_or_404(CardModel, id=id)
        card.delete()
        return {"success": True, "message": f"Card with id {id} deleted successfully."}
    except CardModel.DoesNotExist:
        return 404, {"success": False, "message":f"Card with id {id} not found."}
    except Exception as e:
        return 400, {"success": False,"message":f"Error deleting card: {str(e)}"}
