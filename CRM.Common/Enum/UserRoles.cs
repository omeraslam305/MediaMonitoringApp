using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Common.Enum
{
    public enum UserRoles
    {
        [Description("Media-Admin")]
        MediaAdmin,
        [Description("Media-Print")]
        MediaPrint,
        [Description("Media-Radio")]
        MediaRadio,
        [Description("Media-TV")]
        MediaTV
    }
}
