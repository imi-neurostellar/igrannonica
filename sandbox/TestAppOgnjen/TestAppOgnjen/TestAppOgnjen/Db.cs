using Microsoft.Data.Sqlite;

namespace TestAppOgnjen
{
    public class Db
    {
        private static SqliteConnection _connection = null;

        public static SqliteConnection conn
        {
            get
            {
                if (_connection == null)
                {
                    _connection = new SqliteConnection("Data Source=DB.db");
                }
                return _connection;
            }
        }


    }
}
