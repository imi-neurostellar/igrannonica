namespace api.Services
{
    public interface IChat
    {
        Task SendDirect(string id, string message);
        Task Send(string message);
    }
}