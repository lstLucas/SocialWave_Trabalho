using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialWaveBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class PostAtualizado : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Feed_UserInfos_AuthorId",
                table: "Feed");

            migrationBuilder.DropIndex(
                name: "IX_Feed_AuthorId",
                table: "Feed");

            migrationBuilder.AlterColumn<Guid>(
                name: "AuthorId",
                table: "Feed",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "TEXT",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "AuthorId",
                table: "Feed",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.CreateIndex(
                name: "IX_Feed_AuthorId",
                table: "Feed",
                column: "AuthorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Feed_UserInfos_AuthorId",
                table: "Feed",
                column: "AuthorId",
                principalTable: "UserInfos",
                principalColumn: "Id");

            migrationBuilder.Sql(
                "DELETE FROM AspNetUsers WHERE Id = 'e87e0496-9d48-4549-9ce9-3cad7a521fdb';"
            );
        }
    }
}
