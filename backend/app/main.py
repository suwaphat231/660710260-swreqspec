from fastapi import FastAPI
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware


# บังคับ endpoint ให้รับส่งผ่าน HTTPS ตาม NFR-SEC-01
app = FastAPI()
app.add_middleware(HTTPSRedirectMiddleware)