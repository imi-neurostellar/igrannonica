namespace api.Models
{
    public class ColumnInfo
    {
        public ColumnInfo() { }

        public ColumnInfo(string columnName, bool isNumber, int numNulls, float mean, float min, float max, float median, string[] uniqueValues)
        {
            this.columnName = columnName;
            this.isNumber = isNumber;
            this.numNulls = numNulls;
            this.mean = mean;
            this.min = min;
            this.max = max;
            this.median = median;
            this.uniqueValues = uniqueValues;
        }

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
