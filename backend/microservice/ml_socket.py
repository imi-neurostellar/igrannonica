import asyncio
import websockets
import json

def get_or_create_eventloop():
    try:
        return asyncio.get_event_loop()
    except RuntimeError as ex:
        if "There is no current event loop in thread" in str(ex):
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            return asyncio.get_event_loop()

# create handler for each connection
async def handler(websocket, path):
    #data = json.loads(await websocket.recv())
    #reply = f"Data recieved as:  {data}!"
    #print(data['test'])
    msg = await websocket.recv()
    await websocket.send("[" + msg + "]")

start_server = websockets.serve(handler, "localhost", 5027)

get_or_create_eventloop().run_until_complete(start_server)
get_or_create_eventloop().run_forever()