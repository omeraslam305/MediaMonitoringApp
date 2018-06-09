﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

namespace CRM.Common.Extensions
{
    public static class HttpExtensions
    {
        /// <summary>
        /// Turns a relative URL into a fully qualified URL.
        /// (ie http://domain.com/path?query) 
        /// </summary>
        /// <param name="request"></param>
        /// <param name="relativeUrl"></param>
        /// <returns></returns>
        public static string GetFullUrl(this HttpRequest request, string relativeUrl)
        {
            return String.Format("{0}://{1}{2}",
                            request.Url.Scheme,
                            request.Url.Authority,
                            VirtualPathUtility.ToAbsolute(relativeUrl));
        }
    }

    public static class EnumExtensions
    {
        public static string ToDescriptionString(System.Enum value)
        {
            FieldInfo fi = value.GetType().GetField(value.ToString());

            DescriptionAttribute[] attributes =
                (DescriptionAttribute[])fi.GetCustomAttributes(
                typeof(DescriptionAttribute),
                false);

            if (attributes != null &&
                attributes.Length > 0)
                return attributes[0].Description;
            else
                return value.ToString();
        }
    }

    public static class DatetimeExtensions
    {
        public static string formatMsgDatetime(DateTime msgDate)
        {
            DateTime today = DateTime.Now;
            TimeSpan difference = today - msgDate;
            string replyedDate = "";
            if ((int)difference.TotalDays >= 1)
            {
                replyedDate = msgDate.ToString("MMM dd 'at' hh:mmtt");
            }
            else if (Convert.ToInt32(difference.TotalHours) == 1)
            {
                replyedDate = string.Format("{0} hr ago", Convert.ToInt32(difference.TotalHours));
            }
            else if (Convert.ToInt32(difference.TotalHours) > 1)
            {
                replyedDate = string.Format("{0} hrs ago", Convert.ToInt32(difference.TotalHours));
            }
            else if (Convert.ToInt32(difference.TotalMinutes) == 1)
            {
                replyedDate = string.Format("{0} min ago", Convert.ToInt32(difference.TotalMinutes));
            }
            else if (Convert.ToInt32(difference.TotalMinutes) > 1)
            {
                replyedDate = string.Format("{0} mins ago", Convert.ToInt32(difference.TotalMinutes));
            }
            else if (Convert.ToInt32(difference.TotalSeconds) >= 1)
            {
                replyedDate = string.Format("{0} secs ago", Convert.ToInt32(difference.TotalSeconds));
            }

            return replyedDate;
        }

        public static DateTime ConvertToDateTime(string postCreatedDate)
        {
            var longdate = long.Parse(postCreatedDate);
            DateTime start = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            DateTime date = start.AddSeconds(longdate).ToLocalTime();
            return date;
        }
    }

    public static class StopwordTool
    {
        /// <summary>
        /// Words we want to remove.
        /// </summary>
        static Dictionary<string, bool> _stops = new Dictionary<string, bool>
        {
        { "a", true },
        { "about", true },
        { "above", true },
        { "across", true },
        { "after", true },
        { "afterwards", true },
        { "again", true },
        { "against", true },
        { "all", true },
        { "almost", true },
        { "alone", true },
        { "along", true },
        { "already", true },
        { "also", true },
        { "although", true },
        { "always", true },
        { "am", true },
        { "among", true },
        { "amongst", true },
        { "amount", true },
        { "an", true },
        { "and", true },
        { "another", true },
        { "any", true },
        { "anyhow", true },
        { "anyone", true },
        { "anything", true },
        { "anyway", true },
        { "anywhere", true },
        { "are", true },
        { "around", true },
        { "as", true },
        { "at", true },
        { "back", true },
        { "be", true },
        { "became", true },
        { "because", true },
        { "become", true },
        { "becomes", true },
        { "becoming", true },
        { "been", true },
        { "before", true },
        { "beforehand", true },
        { "behind", true },
        { "being", true },
        { "below", true },
        { "beside", true },
        { "besides", true },
        { "between", true },
        { "beyond", true },
        { "bill", true },
        { "both", true },
        { "bottom", true },
        { "but", true },
        { "by", true },
        { "call", true },
        { "can", true },
        { "cannot", true },
        { "cant", true },
        { "co", true },
        { "computer", true },
        { "con", true },
        { "could", true },
        { "couldnt", true },
        { "cry", true },
        { "de", true },
        { "describe", true },
        { "detail", true },
        { "do", true },
        { "done", true },
        { "down", true },
        { "due", true },
        { "during", true },
        { "each", true },
        { "eg", true },
        { "eight", true },
        { "either", true },
        { "eleven", true },
        { "else", true },
        { "elsewhere", true },
        { "empty", true },
        { "enough", true },
        { "etc", true },
        { "even", true },
        { "ever", true },
        { "every", true },
        { "everyone", true },
        { "everything", true },
        { "everywhere", true },
        { "except", true },
        { "few", true },
        { "fifteen", true },
        { "fify", true },
        { "fill", true },
        { "find", true },
        { "fire", true },
        { "first", true },
        { "five", true },
        { "for", true },
        { "former", true },
        { "formerly", true },
        { "forty", true },
        { "found", true },
        { "four", true },
        { "from", true },
        { "front", true },
        { "full", true },
        { "further", true },
        { "get", true },
        { "give", true },
        { "go", true },
        { "had", true },
        { "has", true },
        { "have", true },
        { "he", true },
        { "hence", true },
        { "her", true },
        { "here", true },
        { "hereafter", true },
        { "hereby", true },
        { "herein", true },
        { "hereupon", true },
        { "hers", true },
        { "herself", true },
        { "him", true },
        { "himself", true },
        { "his", true },
        { "how", true },
        { "however", true },
        { "hundred", true },
        { "i", true },
        { "ie", true },
        { "if", true },
        { "in", true },
        { "inc", true },
        { "indeed", true },
        { "interest", true },
        { "into", true },
        { "is", true },
        { "it", true },
        { "its", true },
        { "itself", true },
        { "keep", true },
        { "last", true },
        { "latter", true },
        { "latterly", true },
        { "least", true },
        { "less", true },
        { "ltd", true },
        { "made", true },
        { "many", true },
        { "may", true },
        { "me", true },
        { "meanwhile", true },
        { "might", true },
        { "mill", true },
        { "mine", true },
        { "more", true },
        { "moreover", true },
        { "most", true },
        { "mostly", true },
        { "move", true },
        { "much", true },
        { "must", true },
        { "my", true },
        { "myself", true },
        { "name", true },
        { "namely", true },
        { "neither", true },
        { "never", true },
        { "nevertheless", true },
        { "next", true },
        { "nine", true },
        { "no", true },
        { "nobody", true },
        { "none", true },
        { "nor", true },
        { "not", true },
        { "nothing", true },
        { "now", true },
        { "nowhere", true },
        { "of", true },
        { "off", true },
        { "often", true },
        { "on", true },
        { "once", true },
        { "one", true },
        { "only", true },
        { "onto", true },
        { "or", true },
        { "other", true },
        { "others", true },
        { "otherwise", true },
        { "our", true },
        { "ours", true },
        { "ourselves", true },
        { "out", true },
        { "over", true },
        { "own", true },
        { "part", true },
        { "per", true },
        { "perhaps", true },
        { "please", true },
        { "put", true },
        { "rather", true },
        { "re", true },
        { "same", true },
        { "see", true },
        { "seem", true },
        { "seemed", true },
        { "seeming", true },
        { "seems", true },
        { "serious", true },
        { "several", true },
        { "she", true },
        { "should", true },
        { "show", true },
        { "side", true },
        { "since", true },
        { "sincere", true },
        { "six", true },
        { "sixty", true },
        { "so", true },
        { "some", true },
        { "somehow", true },
        { "someone", true },
        { "something", true },
        { "sometime", true },
        { "sometimes", true },
        { "somewhere", true },
        { "still", true },
        { "such", true },
        { "system", true },
        { "take", true },
        { "ten", true },
        { "than", true },
        { "that", true },
        { "the", true },
        { "their", true },
        { "them", true },
        { "themselves", true },
        { "then", true },
        { "thence", true },
        { "there", true },
        { "thereafter", true },
        { "thereby", true },
        { "therefore", true },
        { "therein", true },
        { "thereupon", true },
        { "these", true },
        { "they", true },
        { "thick", true },
        { "thin", true },
        { "third", true },
        { "this", true },
        { "those", true },
        { "though", true },
        { "three", true },
        { "through", true },
        { "throughout", true },
        { "thru", true },
        { "thus", true },
        { "to", true },
        { "together", true },
        { "too", true },
        { "top", true },
        { "toward", true },
        { "towards", true },
        { "twelve", true },
        { "twenty", true },
        { "two", true },
        { "un", true },
        { "under", true },
        { "until", true },
        { "up", true },
        { "upon", true },
        { "us", true },
        { "very", true },
        { "via", true },
        { "was", true },
        { "we", true },
        { "well", true },
        { "were", true },
        { "what", true },
        { "whatever", true },
        { "when", true },
        { "whence", true },
        { "whenever", true },
        { "where", true },
        { "whereafter", true },
        { "whereas", true },
        { "whereby", true },
        { "wherein", true },
        { "whereupon", true },
        { "wherever", true },
        { "whether", true },
        { "which", true },
        { "while", true },
        { "whither", true },
        { "who", true },
        { "whoever", true },
        { "whole", true },
        { "whom", true },
        { "whose", true },
        { "why", true },
        { "will", true },
        { "with", true },
        { "within", true },
        { "without", true },
        { "would", true },
        { "yet", true },
        { "you", true },
        { "your", true },
        { "yours", true },
        { "yourself", true },
        { "yourselves", true }
        };

        /// <summary>
        /// Chars that separate words.
        /// </summary>
        static char[] _delimiters = new char[]
        {
        ' ',
        ',',
        ';',
        '.'
        };

        public static bool ValidateParentheses(string word)
        {
            var input = word;
            var stack = new Stack<char>();

            char[] allowedChars = { '(', '[', '{', ')', ']', '}' };

            foreach (char chr in input)
                if (allowedChars.Any(x => x == chr))
                    stack.Push(chr);

            var reverseStack = stack.Reverse();
            var sequencedBalanced = reverseStack.SequenceEqual(stack, BalancedParanthesisComparer.Instance);
            return sequencedBalanced && Regex.Matches(word, @"[a-zA-Z0-9]", RegexOptions.IgnoreCase).Count > 0;
        }

        public static bool IsUrl(string word)
        {
            return (!String.IsNullOrEmpty(word)) ? (Regex.Matches(word, @"^http(s)?://([\w-]+.)+[\w-]+(/[\w- ./?%&=])?$", RegexOptions.IgnoreCase).Count > 0 || word.Contains("http")) : false;
        }

        public static bool IsValidNumber(string word)
        {            
            if (!String.IsNullOrEmpty(word))
            {
                int n;
                bool isNumeric = int.TryParse(word, out n);
                if (isNumeric)
                    return word.Length == 9;
                return true;
            }
            return false;
        }

        /// <summary>
        /// Remove stopwords from string.
        /// </summary>
        public static string RemoveStopwords(string input)
        {
            var words = input.Split(_delimiters, StringSplitOptions.RemoveEmptyEntries);
            StringBuilder builder = new StringBuilder();
            foreach (string currentWord in words)
            {
                string lowerWord = currentWord.ToLower();
                if (!_stops.ContainsKey(lowerWord) && ValidateParentheses(lowerWord) && (!IsUrl(lowerWord)))
                    builder.Append(currentWord).Append(' ');
            }
            return builder.ToString().Trim();
        }

        public static bool HasSpecialChars(string yourString)
        {
            return yourString.Any(ch => !Char.IsLetterOrDigit(ch));
        }

    }

    public sealed class BalancedParanthesisComparer : EqualityComparer<char>
    {
        private static readonly BalancedParanthesisComparer _instance = new BalancedParanthesisComparer();

        private BalancedParanthesisComparer() { }

        public static BalancedParanthesisComparer Instance { get { return _instance; } }

        public override bool Equals(char x, char y)
        {
            if ((x == '(' && y == ')') || (y == '(' && x == ')'))
                return true;
            if ((x == '[' && y == ']') || (y == '[' && x == ']'))
                return true;
            if (x == '{' && y == '}' || (y == '{' && x == '}'))
                return true;

            return false;
        }

        public override int GetHashCode(char obj)
        {
            return base.GetHashCode();
        }

        public override bool Equals(object obj)
        {
            return base.Equals(obj);
        }
    }

    public static class RegexExtensions
    {
        public static string GenerateRegex(string inputValue, string type)
        {
            string regex = "",outputRegex = "";
            try
            {
                string[] inputs = inputValue.Split(' ');
                int arrayLength = inputs.Length;
                int count = 1;
                string sqlFormat = "%{0}%";
                //string jsFormat = @"\\b{0}\\b";
                bool isNumeric = false, isUpperLetter = false, isLowerLetter = false, isSpecialChar = false, IsClose = false;
                for (int i = 0; i <= inputs[0].Length; i++)
                {

                    if (!IsClose)
                    {
                        regex += "[";
                        IsClose = true;
                    }
                    if (count <= arrayLength)
                    {
                        if (i > 0)
                            i--;
                        if (Char.IsNumber(inputs[count - 1][i]))
                        {
                            if (!isNumeric)
                            {
                                regex += "0-9";
                            }
                            isNumeric = true;
                        }
                        else if (Char.IsLetter(inputs[count - 1][i]))
                        {
                            if (Char.IsLower(inputs[count - 1][i]))
                                if (!isLowerLetter)
                                {
                                    regex += "a-z";
                                    isLowerLetter = true;
                                }

                            if (Char.IsUpper(inputs[count - 1][i]))
                                if (!isUpperLetter)
                                {
                                    regex += "A-Z";
                                    isUpperLetter = true;
                                }
                        }
                        else
                        {
                            if (!isSpecialChar)
                            {
                                regex += Char.ToString(inputs[count - 1][i]);
                            }
                            isSpecialChar = true;
                        }
                    }
                    else
                    {
                        count = 0;
                        if (IsClose)
                        {
                            regex += "]";
                            IsClose = false;
                        }
                        isNumeric = isUpperLetter = isLowerLetter = isSpecialChar = false;
                    }
                    count++;
                }
                
                string sqloutputRegex = string.Format(sqlFormat, regex);
                string jsoutputRegex = regex;
                outputRegex = type == "sql" ? sqloutputRegex : jsoutputRegex;
            }
            catch (Exception ex)
            {
                outputRegex = string.Empty;
            }
            return outputRegex;
        }        

    } 

    public static class MathExtentions
    {
        public static double GetMedian(List<double> source)
        {
            // Create a copy of the input, and sort the copy
            double[] temp = source.ToArray();
            Array.Sort(temp);

            int count = temp.Length;
            if (count == 0)
            {
                throw new InvalidOperationException("Empty collection");
            }
            else if (count % 2 == 0)
            {
                // count is even, average two middle elements
                double a = temp[count / 2 - 1];
                double b = temp[count / 2];
                return Convert.ToDouble((a + b) / 2);
            }
            else
            {
                // count is odd, return the middle element
                return temp[count / 2];
            }
        }
    }

    public static class UtilityMethods
    {
        public static bool IsValidEmailAddress(string email)
        {
            if (email.Contains(";"))
            {
                bool isValid = true;
                string[] emailIds = email.Split(';');
                foreach (var emailId in emailIds)
                {
                    isValid = String.IsNullOrEmpty(emailId) ? false : Regex.IsMatch(emailId, @"\A(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\Z", RegexOptions.IgnoreCase);
                    if (!isValid)
                        break;
                }
                return isValid;
            }
            bool isEmail = String.IsNullOrEmpty(email) ? false : Regex.IsMatch(email, @"\A(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\Z", RegexOptions.IgnoreCase);
            return isEmail;
        }
    }

    //public static class KnownFolder
    //{
    //    public static readonly Guid Downloads = new Guid("374DE290-123F-4565-9164-39C4925E467B");
    //}
    public static class KnownFolders
    {
        private static string[] _knownFolderGuids = new string[]
        {
        "{56784854-C6CB-462B-8169-88E350ACB882}", // Contacts
        "{B4BFCC3A-DB2C-424C-B029-7FE99A87C641}", // Desktop
        "{FDD39AD0-238F-46AF-ADB4-6C85480369C7}", // Documents
        "{374DE290-123F-4565-9164-39C4925E467B}", // Downloads
        "{1777F761-68AD-4D8A-87BD-30B759FA33DD}", // Favorites
        "{BFB9D5E0-C6A9-404C-B2B2-AE6DB6AF4968}", // Links
        "{4BD8D571-6D19-48D3-BE97-422220080E43}", // Music
        "{33E28130-4E1E-4676-835A-98395C3BC3BB}", // Pictures
        "{4C5C32FF-BB9D-43B0-B5B4-2D72E54EAAA4}", // SavedGames
        "{7D1D3A04-DEBB-4115-95CF-2F29DA2920DA}", // SavedSearches
        "{18989B1D-99B5-455B-841C-AB7C74E4DDFC}", // Videos
        };

        /// <summary>
        /// Gets the current path to the specified known folder as currently configured. This does
        /// not require the folder to be existent.
        /// </summary>
        /// <param name="knownFolder">The known folder which current path will be returned.</param>
        /// <returns>The default path of the known folder.</returns>
        /// <exception cref="System.Runtime.InteropServices.ExternalException">Thrown if the path
        ///     could not be retrieved.</exception>
        public static string GetPath(KnownFolder knownFolder)
        {
            return GetPath(knownFolder, false);
        }

        /// <summary>
        /// Gets the current path to the specified known folder as currently configured. This does
        /// not require the folder to be existent.
        /// </summary>
        /// <param name="knownFolder">The known folder which current path will be returned.</param>
        /// <param name="defaultUser">Specifies if the paths of the default user (user profile
        ///     template) will be used. This requires administrative rights.</param>
        /// <returns>The default path of the known folder.</returns>
        /// <exception cref="System.Runtime.InteropServices.ExternalException">Thrown if the path
        ///     could not be retrieved.</exception>
        public static string GetPath(KnownFolder knownFolder, bool defaultUser)
        {
            return GetPath(knownFolder, KnownFolderFlags.DontVerify, defaultUser);
        }

        private static string GetPath(KnownFolder knownFolder, KnownFolderFlags flags,
            bool defaultUser)
        {
            IntPtr outPath;
            int result = SHGetKnownFolderPath(new Guid(_knownFolderGuids[(int)knownFolder]),
                (uint)flags, new IntPtr(defaultUser ? -1 : 0), out outPath);
            if (result >= 0)
            {
                return Marshal.PtrToStringUni(outPath);
            }
            else
            {
                throw new ExternalException("Unable to retrieve the known folder path. It may not "
                    + "be available on this system.", result);
            }
        }

        [DllImport("Shell32.dll")]
        private static extern int SHGetKnownFolderPath(
            [MarshalAs(UnmanagedType.LPStruct)]Guid rfid, uint dwFlags, IntPtr hToken,
            out IntPtr ppszPath);

        [Flags]
        private enum KnownFolderFlags : uint
        {
            SimpleIDList = 0x00000100,
            NotParentRelative = 0x00000200,
            DefaultPath = 0x00000400,
            Init = 0x00000800,
            NoAlias = 0x00001000,
            DontUnexpand = 0x00002000,
            DontVerify = 0x00004000,
            Create = 0x00008000,
            NoAppcontainerRedirection = 0x00010000,
            AliasOnly = 0x80000000
        }
    }

    /// <summary>
    /// Standard folders registered with the system. These folders are installed with Windows Vista
    /// and later operating systems, and a computer will have only folders appropriate to it
    /// installed.
    /// </summary>
    public enum KnownFolder
    {
        Contacts,
        Desktop,
        Documents,
        Downloads,
        Favorites,
        Links,
        Music,
        Pictures,
        SavedGames,
        SavedSearches,
        Videos
    }

}
