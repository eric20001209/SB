﻿using Microsoft.EntityFrameworkCore.Migrations;

namespace SB.Migrations
{
    public partial class paymentmethod : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
            name: "payment_method",
            table: "tran_invoice",
            nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}