﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Dto
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public bool Active { get; set; }
        public int? Parent_Id { get; set; }
        public int? LayerLevel { get; set; }
    }
}
