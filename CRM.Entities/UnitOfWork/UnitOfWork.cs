using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repositories.Repository;
using CRM.Entities;

namespace Repositories.UnitOfWork
{

    public class UnitOfWork : IDisposable
    {
        private SocialCRMEntities context = new SocialCRMEntities();


        /*private GenericRepository<Profile> profileRepository;

        public GenericRepository<Profile> ProfileRepository
        {
            get
            {
                if (this.profileRepository == null)
                    this.profileRepository = new GenericRepository<Profile>(context);
                return profileRepository;
            }
        }*/

        public void Save()
        {
            try
            {
                context.SaveChanges();
                
                //refresh DB Context.
                var dbContext = ((System.Data.Entity.Infrastructure.IObjectContextAdapter)context).ObjectContext;
                var refreshableObjects = context.ChangeTracker.Entries().Select(c => c.Entity).ToList();
                dbContext.Refresh(System.Data.Entity.Core.Objects.RefreshMode.StoreWins, refreshableObjects);
            }
            catch (System.Data.Entity.Validation.DbEntityValidationException e)
            {
                var outputLines = new List<string>();
                foreach (var eve in e.EntityValidationErrors)
                {
                    outputLines.Add(string.Format(
                        "{0}: Entity of type \"{1}\" in state \"{2}\" has the following validation errors:",
                        DateTime.Now, eve.Entry.Entity.GetType().Name, eve.Entry.State));
                    foreach (var ve in eve.ValidationErrors)
                    {
                        outputLines.Add(string.Format(
                            "- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage));
                    }
                }
                throw new Exception(string.Join(",", outputLines.ToArray()), e);
            }
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
