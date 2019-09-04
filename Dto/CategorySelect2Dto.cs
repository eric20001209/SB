using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Dto
{
    public class CategorySelect2Dto
    {
        public int id { get; set; }
        public string text { get; set; }
        public List<CategorySelect2Dto> inc = new List<CategorySelect2Dto>();
        public bool Active { get; set; }
        public int? Parent_Id { get; set; }
    }
}
