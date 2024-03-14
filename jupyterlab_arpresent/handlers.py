import datetime
import json
import os
import uuid

import jwt
import tornado
from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join

app_access_key = os.getenv("ONEHUNDRED_MS_API_KEY")
app_secret = os.getenv("ONEHUNDRED_MS_API_SECRET")


class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self, room_id, user_id, role):
        # jupyterlab-arpresent/get-token
        # generate auth token
        os.gete
        expires = 24 * 3600
        now = datetime.datetime.utcnow()
        exp = now + datetime.timedelta(seconds=expires)
        token = jwt.encode(
            payload={
                "access_key": app_access_key,
                "type": "app",
                "version": 2,
                "room_id": room_id,
                "user_id": user_id,
                "role": role,
                "jti": str(uuid.uuid4()),
                "exp": exp,
                "iat": now,
                "nbf": now,
            },
            key=app_secret,
        )

        return self.write(json.dumps(token))


def setup_handlers(web_app):
    print(app_access_key, app_secret)
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, "jupyterlab-arpresent", "get-token")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)
