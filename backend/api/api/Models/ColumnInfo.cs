namespace api.Models
{
    public class ColumnInfo
    {
        public string columnName { get; set; }
        public bool isNumber { get; set; }
        public int numNulls { get; set; }
        public float mean { get; set; }
        public float min { get; set; }
        public float max { get; set; }
        public float median { get; set; }
        public string[] uniqueValues { get; set; }

    }
}
