using System.Net.WebSockets;
using System.Text;

namespace api.Services
{
    public class MLWebSocketService: BackgroundService, IMLWebSocketService
    {
        private static readonly string Connection = "ws://localhost:5027";

        private Queue<string> dataQueue = new Queue<string>();

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
                using (var socket = new ClientWebSocket())
                    try
                    {
                        await socket.ConnectAsync(new Uri(Connection), stoppingToken);


                        while(dataQueue.Count > 0)
                        {
                            await Send(socket, dataQueue.Dequeue(), stoppingToken);
                        }

                        Receive(socket, stoppingToken);

                        await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", stoppingToken);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"ERROR - {ex.Message}");
                    }
        }

        private async Task Send(ClientWebSocket socket, string data, CancellationToken stoppingToken) =>
            await socket.SendAsync(Encoding.UTF8.GetBytes(data), WebSocketMessageType.Text, true, stoppingToken);

        private async Task Receive(ClientWebSocket socket, CancellationToken stoppingToken)
        {
            var buffer = new ArraySegment<byte>(new byte[2048]);
            while (!stoppingToken.IsCancellationRequested)
            {
                WebSocketReceiveResult result;
                using (var ms = new MemoryStream())
                {
                    do
                    {
                        result = await socket.ReceiveAsync(buffer, stoppingToken);
                        ms.Write(buffer.Array, buffer.Offset, result.Count);
                    } while (!result.EndOfMessage);

                    if (result.MessageType == WebSocketMessageType.Close)
                        break;

                    ms.Seek(0, SeekOrigin.Begin);
                    using (var reader = new StreamReader(ms, Encoding.UTF8))
                        Console.WriteLine(await reader.ReadToEndAsync());
                }
            };
        }

        public void Send(string data)
        {
            dataQueue.Enqueue(data);
        }
    }
}
