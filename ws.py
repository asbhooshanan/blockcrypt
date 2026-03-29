import asyncio
import websockets
import json

# CONNECTIONS = set()

# async def echo(websocket):
#   if websocket not in CONNECTIONS:
#     CONNECTIONS.add(websocket)
#   async for message in websocket:
#     websockets.broadcast(CONNECTIONS,message)

# async def main():
#     async with websockets.serve(echo, "localhost", 8765):
#         await asyncio.Future()  # run forever

# asyncio.run(main())

# async def echo(websocket):
#     async for message in websocket:
#         await websocket.send(message)

# async def main():
#     async with websockets.serve(echo, "localhost", 8765):
#         print("Server running...")
#         await asyncio.Future()
async def handler(websocket):
    print("Electron connected")

    await websocket.send(json.dumps({
        "type": "welcome",
        "message": "Hello from Python!"
    }))

    await asyncio.sleep(3)

    await websocket.send(json.dumps({
        "type": "info",
        "message": "Second message from Python (after 3 seconds)"
    }))


    async for message in websocket:
        print("Received:", message)

async def main():
    async with websockets.serve(handler, "127.0.0.1", 8777):
        print("🚀 Server running on ws://127.0.0.1:8777")
        await asyncio.Future()

asyncio.run(main())

