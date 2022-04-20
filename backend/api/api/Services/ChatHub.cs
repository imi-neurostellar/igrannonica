using api.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Threading.Tasks;



namespace api.Services
{
    public class ChatHub :Hub
    {
        static public readonly Dictionary<string,string> Users=new Dictionary<string,string>();
        private readonly IJwtToken _tokenService;
        public ChatHub(IJwtToken tokenService)
        {
            _tokenService=tokenService;
        }

        public override async Task OnConnectedAsync()
        {
            string token=Context.GetHttpContext().Request.Query["access_token"];
            if (token == null)
                return;
            string id=_tokenService.TokenToId(token);
            if (!Users.ContainsKey(id))
                Users.Add(id, Context.ConnectionId);
            else
                Users[id] = Context.ConnectionId;
            //await SendDirect(id, "poruka");
            //await Send(Context.ConnectionId);
            await base.OnConnectedAsync();

        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var user = Users.Values.Contains(Context.ConnectionId);
            if (user==false)
                return;
            Users.Remove(Users.FirstOrDefault(u => u.Value == Context.ConnectionId).Key);
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
        public static bool CheckUser(string id)
        {
            if (Users[id] == null)
                return false;
            return true;
        }
    }
    

}
