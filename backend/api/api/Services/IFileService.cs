﻿using api.Models;

namespace api.Services
{
    public interface IFileService
    {
        FileModel Create(FileModel file);
        string GetFilePath(string id, string username);
    }
}