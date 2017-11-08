# Copyright 2017 Intel Corporation
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ------------------------------------------------------------------------------

from functools import wraps

from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import BadSignature
from sanic import Blueprint
from sanic.response import json

from api.errors import ApiBadRequest, ApiUnauthorized


AUTH_BP = Blueprint('auth')


def authorized():
    def decorator(func):
        @wraps(func)
        async def decorated_function(request, *args, **kwargs):
            if request.token is None:
                raise ApiUnauthorized("Unauthorized: No bearer token provided")
            is_authorized = await validate_apikey(
                request.token, request.app.config.SECRET_KEY)
            if is_authorized:
                response = await func(request, *args, **kwargs)
                return response
            else:
                raise ApiUnauthorized("Unauthorized: Invalid bearer token")
        return decorated_function
    return decorator


async def generate_apikey(user_id, secret_key):
    serializer = Serializer(secret_key)
    return serializer.dumps({'id': user_id})


async def validate_apikey(token, secret_key):
    serializer = Serializer(secret_key)
    try:
        serializer.loads(token)
    except BadSignature:
        return False
    return True


@AUTH_BP.post('api/authorization')
async def get_apikey(request):
    try:
        user_id = request.json.get('id')
    except Exception:
        raise ApiBadRequest("Bad Request: Improper JSON format")
    token = await generate_apikey(user_id, request.app.config.SECRET_KEY)
    return json(
        {
            'data': {
                'auth_token': token.decode('ascii')
            }
        }
    )