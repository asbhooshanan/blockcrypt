import asyncio
import websockets

async def test_ws():
    """Test the websocket"""
    uri = "ws://localhost:8765"
    
    try:
        print(f"🔌 Connecting to {uri}...")
        async with websockets.connect(uri) as websocket:
            print("✅ Connected successfully!")
            
            # Wait for welcome message
            welcome = await websocket.recv()
            print(f"📩 Welcome: {welcome}")
            
            response = await websocket.recv()
            print(f"📥 Response: {response}")
            
            print("✅ All tests passed!")
            
    except Exception as e:
        print(f"❌ Error: {e}")

#if __name__ == "__main__":
asyncio.run(test_ws())