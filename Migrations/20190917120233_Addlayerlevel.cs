using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SB.Migrations
{
    public partial class Addlayerlevel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {


            migrationBuilder.AddColumn<int>(
                name: "layer_level",
                table: "Category",
                nullable: true);


        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Barcode");

            migrationBuilder.DropTable(
                name: "branch");

            migrationBuilder.DropTable(
                name: "card");

            migrationBuilder.DropTable(
                name: "code_relations");

            migrationBuilder.DropTable(
                name: "enum");

            migrationBuilder.DropTable(
                name: "ItemToCategory");

            migrationBuilder.DropTable(
                name: "order_item");

            migrationBuilder.DropTable(
                name: "orders");

            migrationBuilder.DropTable(
                name: "sales");

            migrationBuilder.DropTable(
                name: "tran_detail");

            migrationBuilder.DropTable(
                name: "tran_invoice");

            migrationBuilder.DropTable(
                name: "trans");

            migrationBuilder.DropTable(
                name: "Unit");

            migrationBuilder.DropTable(
                name: "Item");

            migrationBuilder.DropTable(
                name: "invoice");

            migrationBuilder.DropTable(
                name: "Category");
        }
    }
}
