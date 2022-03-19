using api.Interfaces;
using MongoDB.Driver;

namespace api.Services
{
    public class TempFileService : IHostedService
    {
        private readonly FileService _fileService;
        private Timer _timer;

        public TempFileService(IUserStoreDatabaseSettings settings, IMongoClient mongoClient)
        {
            _fileService = new FileService(settings,mongoClient);
        }
        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(RemoveTempFiles,null,TimeSpan.Zero,TimeSpan.FromHours(3));


            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }
        private void RemoveTempFiles(object state)
        {
            _fileService.DeleteTempFiles();
        }
    }
}
