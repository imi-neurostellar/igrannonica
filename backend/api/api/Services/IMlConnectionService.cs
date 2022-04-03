﻿
using api.Models;

namespace api.Services
{
    public interface IMlConnectionService
    {
        Task<string> SendModelAsync(object model, object dataset);
        Task<Dataset> PreProcess(Dataset dataset, string filePath);
        //Task<Dataset> PreProcess(Dataset dataset, byte[] file, string filename);
    }
}