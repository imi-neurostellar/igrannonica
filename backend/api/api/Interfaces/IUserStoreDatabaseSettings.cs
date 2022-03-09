namespace api.Interfaces
{
    public interface IUserStoreDatabaseSettings
    {
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
        string CollectionName { get; set; }
        string DatasetCollectionName { get; set; }
    }
}
