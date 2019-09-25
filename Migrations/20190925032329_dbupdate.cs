using Microsoft.EntityFrameworkCore.Migrations;

namespace SB.Migrations
{
    public partial class dbupdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Item_Category_Categoryid",
                table: "Item");

            migrationBuilder.DropForeignKey(
                name: "FK_Item_Unit_Unitid",
                table: "Item");

            migrationBuilder.DropIndex(
                name: "IX_Item_Categoryid",
                table: "Item");

            migrationBuilder.DropIndex(
                name: "IX_Item_Unitid",
                table: "Item");

            migrationBuilder.RenameColumn(
                name: "Unitid",
                table: "Item",
                newName: "unitid");

            migrationBuilder.RenameColumn(
                name: "Categoryid",
                table: "Item",
                newName: "categoryid");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "unitid",
                table: "Item",
                newName: "Unitid");

            migrationBuilder.RenameColumn(
                name: "categoryid",
                table: "Item",
                newName: "Categoryid");

            migrationBuilder.CreateIndex(
                name: "IX_Item_Categoryid",
                table: "Item",
                column: "Categoryid");

            migrationBuilder.CreateIndex(
                name: "IX_Item_Unitid",
                table: "Item",
                column: "Unitid");

            migrationBuilder.AddForeignKey(
                name: "FK_Item_Category_Categoryid",
                table: "Item",
                column: "Categoryid",
                principalTable: "Category",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Item_Unit_Unitid",
                table: "Item",
                column: "Unitid",
                principalTable: "Unit",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
