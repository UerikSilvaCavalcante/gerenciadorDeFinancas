from ninja import NinjaAPI
from user.api import router as user_router 
from transfer.api import router as transfer_router
from card.api import router as card_router
from dashboard.api import router as dashboard_router

api = NinjaAPI()
api.add_router("/user/", user_router)
api.add_router("/transfer/", transfer_router)
api.add_router("/card/", card_router)
api.add_router("/dashboard/", dashboard_router)
