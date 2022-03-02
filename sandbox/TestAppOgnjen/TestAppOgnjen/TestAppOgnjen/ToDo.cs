namespace TestAppOgnjen
{
    public class ToDo
    {
        public int id;
        public string task;
        public int done;

        public ToDo()
        {

        }
        public ToDo(int id, string task, int done)
        {
            this.id = id;
            this.task = task;
            this.done = done;
        }
    }
}
