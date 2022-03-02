using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Linq;
using System.Threading.Tasks;

namespace MiniApkSonja
{
    public class DatabaseConnection
    {
        private static SQLiteConnection _connection = null;

        public static SQLiteConnection Connection
        {
            get
            {
                if (_connection == null)
                    _connection = new SQLiteConnection("Data Source=probnaBaza.db");
                return _connection;
            }
        }
    }
}
