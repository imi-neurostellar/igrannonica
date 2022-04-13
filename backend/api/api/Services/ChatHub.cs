using api.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Threading.Tasks;



namespace api.Services
{
    public class ChatHub :Hub,IChat
    {
        static readonly Dictionary<string,string> Users=new Dictionary<string,string>();
        private readonly IJwtToken _tokenService;
        public ChatHub(IJwtToken tokenService)
        {
            _tokenService=tokenService;
        }

        public override async Task OnConnectedAsync()
        {
            string token=Context.GetHttpContext().Request.Query["access_token"];
            string id=_tokenService.TokenToId(token);
            Users.Add(id,Context.ConnectionId);
            await SendDirect(id, "poruka");
            //await Send(Context.ConnectionId);
            await base.OnConnectedAsync();

        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            string id = Users.FirstOrDefault(u => u.Value == Context.ConnectionId).Key;
            Users.Remove(id);
        }
        public async Task SendDirect(string id,string message)
        {
            if (Users[id]==null)
                return;

            await Clients.Client(Users[id]).SendAsync("Notify",message);
        }
        public async Task Send(string message)
        {
            await Clients.All.SendAsync("Notify",message);
        }
    }
    

}
