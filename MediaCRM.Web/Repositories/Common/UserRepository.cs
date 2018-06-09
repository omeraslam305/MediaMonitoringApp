using CRM.Common.Enum;
using CRM.Entities;
using SocialCRM.Web.Models.User;
using SocialCRM.Web.Repositories.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using SocialCRM.Web.Models.Common.User;
using SocialCRM.Web.Models.Media.Form;
using System.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;
using CRM.Common;
using System.Configuration;
using Microsoft.AspNet.Identity;
using SocialCRM.Web.Models.Media.Channel;

namespace SocialCRM.Web.Repositories
{
    public class UserRepository : IUserRepository
    {
        public async Task<UserListModel> GeMediaUserList(int userId, string appType,int pageNumber)
        {
            UserListModel result = new UserListModel();
            result.UserList = new List<UserModel>();
            int pageSize = 5;
            pageNumber = pageNumber * pageSize;
            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
                    {
                        decimal[] rightsArray = { 1, 2, 3, 4 };
                        decimal[] rolesArray = { 2, 3, 4 };
                        var userList = db.AspNetUsers.ToList().Where(x => x.AspNetRoles.Where(y => rightsArray.Contains(y.Id)).Count() > 0 && x.Id != userId).OrderByDescending(y => y.Id).ToList();
                        result.TotalRecords = userList.Count;
                        userList = userList.Skip(pageNumber).Take(pageSize).ToList();
                        foreach (var item in userList)
                        {
                            UserModel model = new UserModel();
                            model.Id = item.Id;
                            model.Name = item.Name;
                            model.Email = item.Email;
                            model.ProfileUrl = item.ProfileImage;
                            model.IsEnabled = item.EmailConfirmed;
                            model.RightsArray = item.AspNetRoles.Select(x => x.Id).ToList<int>();
                            model.RightName = item.AspNetRoles.Where(x => x.Id == 1).Count() > 0 ? "Admin" : "User";
                            model.TvRightCss = model.RadioRightCss = model.PrintRightCss = "inactivetag";
                            if (model.RightName != "Admin")
                            {
                                foreach (var right in item.AspNetRoles)
                                {
                                    if (right.Id == 2)
                                        model.PrintRightCss = "printtag";
                                    else if (right.Id == 3)
                                        model.RadioRightCss = "radiotag";
                                    else if (right.Id == 4)
                                        model.TvRightCss = "tvtag";
                                }
                            }
                            result.UserList.Add(model);
                        }
                        result.MediaTypesList = new List<SelectItemList>();
                        
                        db.AspNetRoles.Where(y => rolesArray.Contains(y.Id)).ToList().ForEach(delegate (AspNetRole obj)
                        {
                            result.MediaTypesList.Add(new SelectItemList()
                            {
                                Value = obj.Id,
                                Text = obj.Name,
                                MediaTypeId = 0
                            });
                        });
                    }
                });
                
            }
            catch (Exception ex)
            {
                result = null;
            }
            return result;
        }
        public async Task<RegisterViewModel> GetUserByEmailId(string emailId, string appType)
        {
            RegisterViewModel userModel = null;
            try
            {

                await Task.Run(() =>
                {
                    using (var db = new SocialCRMEntities())
                    {
                        var user = db.AspNetUsers.Where(x => string.Compare(x.Email, emailId) == 0).FirstOrDefault();
                        if (user != null)
                        {
                            userModel = new RegisterViewModel
                            {
                                Name = user.Name,
                                Email = user.Email,
                                ImageUrl = user.ProfileImage,
                                UserId = user.Id,
                                SignHTML = user.SignHTML
                            };
                            userModel.UserRoles = user.AspNetRoles.Where(x => x.Name.StartsWith(appType)).Select(x => x.Name).ToList();
                            userModel.AppType = appType;
                        }
                        db.Dispose();
                    }
                });
                return userModel;
            }
            catch (Exception ex)
            {
                return userModel;
            }
        }

        public async Task<bool> UpdatePersonalProfile(PersonalProfileModel model)
        {
            var success = false;
            await Task.Run(() =>
            {
                using (var db = new SocialCRMEntities())
                {
                    var userProfile = db.AspNetUsers.Where(z => z.Email == model.Email).FirstOrDefault();
                    userProfile.Name = model.Name;
                    userProfile.ProfileImage = model.ProfileUrl;
                    userProfile.SignHTML = model.SignHtml;

                    db.SaveChanges();
                    db.Dispose();
                }
            });
            return success;
        }

        public async Task<bool> SaveUser(UserSaveModel model, int userId)
        {
            bool result = false;
            try
            {
                using (SocialCRMEntities db = new SocialCRMEntities())
                {
                    var form = new AspNetUser();
                    if (model.Id > 0)
                    {
                        form = db.AspNetUsers.Find(model.Id);
                    }
                    else
                    {
                        
                    }
                    

                    if (model.Id > 0)
                    {
                        //form.Categories.Clear();
                        //foreach (var item in categories)
                        //{
                        //    form.Categories.Add(db.Categories.Find(item));
                        //}
                        //db.MediaNews.Attach(form);
                        //db.Entry(form).State = EntityState.Modified;
                    }
                    else
                    {
                        //foreach (var item in categories)
                        //{
                        //    form.Categories.Add(db.Categories.Find(item));
                        //}
                        //db.MediaNews.Add(form);
                    }
                    db.SaveChanges();
                    result = true;
                }
            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;
        }
        public async Task<bool> DeleteUserReference(int id)
        {
            bool result = false;
            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
                    {
                        var list = db.MediaNews.Where(x => x.CreatedBy.HasValue ? (x.CreatedBy.Value == id) : false).ToList();
                        foreach (var news in list)
                        {
                            news.CreatedBy = null;
                            db.MediaNews.Attach(news);
                            db.Entry(news).State = EntityState.Modified;
                            db.SaveChanges();
                        }
                        result = true;
                    }
                });
                    
            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;
        }
    }
}