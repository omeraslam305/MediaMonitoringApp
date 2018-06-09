
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 01/13/2017 16:54:04
-- Generated from EDMX file: D:\Projects\TFS\KE-CRM-Media\CRM.Entities\SocialCRM.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [Insight360MediaCRM_KE];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_ChannelScores_NewsType]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[ChannelScores] DROP CONSTRAINT [FK_ChannelScores_NewsType];
GO
IF OBJECT_ID(N'[dbo].[FK_ChannelScores_Sentiments]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[ChannelScores] DROP CONSTRAINT [FK_ChannelScores_Sentiments];
GO
IF OBJECT_ID(N'[dbo].[FK_dbo_AspNetUserClaims_dbo_AspNetUsers_UserId]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[AspNetUserClaims] DROP CONSTRAINT [FK_dbo_AspNetUserClaims_dbo_AspNetUsers_UserId];
GO
IF OBJECT_ID(N'[dbo].[FK_dbo_AspNetUserLogins_dbo_AspNetUsers_UserId]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[AspNetUserLogins] DROP CONSTRAINT [FK_dbo_AspNetUserLogins_dbo_AspNetUsers_UserId];
GO
IF OBJECT_ID(N'[dbo].[FK_dbo_AspNetUserRoles_dbo_AspNetRoles_RoleId]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[AspNetUserRoles] DROP CONSTRAINT [FK_dbo_AspNetUserRoles_dbo_AspNetRoles_RoleId];
GO
IF OBJECT_ID(N'[dbo].[FK_dbo_AspNetUserRoles_dbo_AspNetUsers_UserId]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[AspNetUserRoles] DROP CONSTRAINT [FK_dbo_AspNetUserRoles_dbo_AspNetUsers_UserId];
GO
IF OBJECT_ID(N'[dbo].[FK_EmailAssignedRights_Email]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[EmailAssignedRights] DROP CONSTRAINT [FK_EmailAssignedRights_Email];
GO
IF OBJECT_ID(N'[dbo].[FK_EmailAssignedRights_EmailRights]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[EmailAssignedRights] DROP CONSTRAINT [FK_EmailAssignedRights_EmailRights];
GO
IF OBJECT_ID(N'[dbo].[FK_MediaChannels_MediaType]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MediaChannels] DROP CONSTRAINT [FK_MediaChannels_MediaType];
GO
IF OBJECT_ID(N'[dbo].[FK_MediaNews_AspNetUsers_CreatedBy]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MediaNews] DROP CONSTRAINT [FK_MediaNews_AspNetUsers_CreatedBy];
GO
IF OBJECT_ID(N'[dbo].[FK_MediaNews_AspNetUsersUpdatedBy]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MediaNews] DROP CONSTRAINT [FK_MediaNews_AspNetUsersUpdatedBy];
GO
IF OBJECT_ID(N'[dbo].[FK_MediaNews_City]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MediaNews] DROP CONSTRAINT [FK_MediaNews_City];
GO
IF OBJECT_ID(N'[dbo].[FK_MediaNews_MediaChannels]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MediaNews] DROP CONSTRAINT [FK_MediaNews_MediaChannels];
GO
IF OBJECT_ID(N'[dbo].[FK_MediaNews_MediaType]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MediaNews] DROP CONSTRAINT [FK_MediaNews_MediaType];
GO
IF OBJECT_ID(N'[dbo].[FK_MediaNews_NewsType]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MediaNews] DROP CONSTRAINT [FK_MediaNews_NewsType];
GO
IF OBJECT_ID(N'[dbo].[FK_MediaNews_Sentiments]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MediaNews] DROP CONSTRAINT [FK_MediaNews_Sentiments];
GO
IF OBJECT_ID(N'[dbo].[FK_MediaNews_Status]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MediaNews] DROP CONSTRAINT [FK_MediaNews_Status];
GO
IF OBJECT_ID(N'[dbo].[FK_MediaNewsCategories_Categories]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MediaNewsCategories] DROP CONSTRAINT [FK_MediaNewsCategories_Categories];
GO
IF OBJECT_ID(N'[dbo].[FK_MediaNewsCategories_MediaNews]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MediaNewsCategories] DROP CONSTRAINT [FK_MediaNewsCategories_MediaNews];
GO
IF OBJECT_ID(N'[dbo].[FK_MediaType_NewsType]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[NewsType] DROP CONSTRAINT [FK_MediaType_NewsType];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[AspNetRoles]', 'U') IS NOT NULL
    DROP TABLE [dbo].[AspNetRoles];
GO
IF OBJECT_ID(N'[dbo].[AspNetUserClaims]', 'U') IS NOT NULL
    DROP TABLE [dbo].[AspNetUserClaims];
GO
IF OBJECT_ID(N'[dbo].[AspNetUserLogins]', 'U') IS NOT NULL
    DROP TABLE [dbo].[AspNetUserLogins];
GO
IF OBJECT_ID(N'[dbo].[AspNetUserRoles]', 'U') IS NOT NULL
    DROP TABLE [dbo].[AspNetUserRoles];
GO
IF OBJECT_ID(N'[dbo].[AspNetUsers]', 'U') IS NOT NULL
    DROP TABLE [dbo].[AspNetUsers];
GO
IF OBJECT_ID(N'[dbo].[Categories]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Categories];
GO
IF OBJECT_ID(N'[dbo].[ChannelScores]', 'U') IS NOT NULL
    DROP TABLE [dbo].[ChannelScores];
GO
IF OBJECT_ID(N'[dbo].[City]', 'U') IS NOT NULL
    DROP TABLE [dbo].[City];
GO
IF OBJECT_ID(N'[dbo].[Email]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Email];
GO
IF OBJECT_ID(N'[dbo].[EmailAssignedRights]', 'U') IS NOT NULL
    DROP TABLE [dbo].[EmailAssignedRights];
GO
IF OBJECT_ID(N'[dbo].[EmailRights]', 'U') IS NOT NULL
    DROP TABLE [dbo].[EmailRights];
GO
IF OBJECT_ID(N'[dbo].[MediaChannels]', 'U') IS NOT NULL
    DROP TABLE [dbo].[MediaChannels];
GO
IF OBJECT_ID(N'[dbo].[MediaNews]', 'U') IS NOT NULL
    DROP TABLE [dbo].[MediaNews];
GO
IF OBJECT_ID(N'[dbo].[MediaNewsAttachment]', 'U') IS NOT NULL
    DROP TABLE [dbo].[MediaNewsAttachment];
GO
IF OBJECT_ID(N'[dbo].[MediaNewsCategories]', 'U') IS NOT NULL
    DROP TABLE [dbo].[MediaNewsCategories];
GO
IF OBJECT_ID(N'[dbo].[MediaType]', 'U') IS NOT NULL
    DROP TABLE [dbo].[MediaType];
GO
IF OBJECT_ID(N'[dbo].[NewsType]', 'U') IS NOT NULL
    DROP TABLE [dbo].[NewsType];
GO
IF OBJECT_ID(N'[dbo].[Sentiments]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Sentiments];
GO
IF OBJECT_ID(N'[dbo].[Status]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Status];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'AspNetRoles'
CREATE TABLE [dbo].[AspNetRoles] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(256)  NOT NULL
);
GO

-- Creating table 'AspNetUserClaims'
CREATE TABLE [dbo].[AspNetUserClaims] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [UserId] int  NOT NULL,
    [ClaimType] nvarchar(max)  NULL,
    [ClaimValue] nvarchar(max)  NULL
);
GO

-- Creating table 'AspNetUserLogins'
CREATE TABLE [dbo].[AspNetUserLogins] (
    [UserId] int  NOT NULL,
    [LoginProvider] nvarchar(128)  NOT NULL,
    [ProviderKey] nvarchar(128)  NOT NULL
);
GO

-- Creating table 'AspNetUsers'
CREATE TABLE [dbo].[AspNetUsers] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(max)  NULL,
    [ProfileImage] nvarchar(max)  NULL,
    [ConfirmationCode] nvarchar(max)  NULL,
    [Email] nvarchar(256)  NULL,
    [EmailConfirmed] bit  NOT NULL,
    [PasswordHash] nvarchar(max)  NULL,
    [SecurityStamp] nvarchar(max)  NULL,
    [PhoneNumber] nvarchar(max)  NULL,
    [PhoneNumberConfirmed] bit  NOT NULL,
    [TwoFactorEnabled] bit  NOT NULL,
    [LockoutEndDateUtc] datetime  NULL,
    [LockoutEnabled] bit  NOT NULL,
    [AccessFailedCount] int  NOT NULL,
    [UserName] nvarchar(256)  NOT NULL
);
GO

-- Creating table 'Cities'
CREATE TABLE [dbo].[Cities] (
    [CityId] int IDENTITY(1,1) NOT NULL,
    [CityName] varchar(500)  NOT NULL
);
GO

-- Creating table 'MediaChannels'
CREATE TABLE [dbo].[MediaChannels] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [ChannelName] varchar(500)  NOT NULL,
    [MediaTypeId] int  NOT NULL
);
GO

-- Creating table 'MediaTypes'
CREATE TABLE [dbo].[MediaTypes] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [TypeName] varchar(200)  NOT NULL
);
GO

-- Creating table 'NewsTypes'
CREATE TABLE [dbo].[NewsTypes] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [NewsTypeName] varchar(500)  NOT NULL,
    [MediaTypeId] int  NOT NULL
);
GO

-- Creating table 'Sentiments'
CREATE TABLE [dbo].[Sentiments] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] varchar(500)  NOT NULL
);
GO

-- Creating table 'Status'
CREATE TABLE [dbo].[Status] (
    [StatusId] int IDENTITY(1,1) NOT NULL,
    [StatusName] varchar(500)  NOT NULL
);
GO

-- Creating table 'Emails'
CREATE TABLE [dbo].[Emails] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [EmailId] varchar(500)  NOT NULL
);
GO

-- Creating table 'EmailRights'
CREATE TABLE [dbo].[EmailRights] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [EmailRightName] varchar(500)  NOT NULL
);
GO

-- Creating table 'MediaNewsAttachments'
CREATE TABLE [dbo].[MediaNewsAttachments] (
    [MediaNewsId] int  NOT NULL,
    [FileName] varchar(500)  NULL,
    [ContentType] varchar(200)  NULL,
    [FileContent] varbinary(max)  NULL
);
GO

-- Creating table 'Categories'
CREATE TABLE [dbo].[Categories] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [CategoryName] varchar(500)  NOT NULL
);
GO

-- Creating table 'MediaNews'
CREATE TABLE [dbo].[MediaNews] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [MediaTypeId] int  NOT NULL,
    [NewsTypeId] int  NOT NULL,
    [ChannelId] int  NULL,
    [CityId] int  NULL,
    [NewsDate] datetime  NOT NULL,
    [NewsTime] time  NULL,
    [SentimentId] int  NOT NULL,
    [Script] varchar(max)  NULL,
    [ColumnNumber] int  NULL,
    [ColumnHeight] int  NULL,
    [AdvertisingRate] varchar(500)  NULL,
    [ParValue] varchar(500)  NULL,
    [Multiplier] int  NULL,
    [StatusId] int  NULL,
    [CreatedBy] int  NULL,
    [CreatedDate] datetime  NULL,
    [UpdatedBy] int  NULL,
    [UpdatedDate] datetime  NULL
);
GO

-- Creating table 'ChannelScores'
CREATE TABLE [dbo].[ChannelScores] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [MediaTypeId] int  NOT NULL,
    [NewsTypeId] int  NOT NULL,
    [SentimentId] int  NOT NULL,
    [TimSlot] varchar(500)  NULL,
    [Score] int  NOT NULL,
    [ChannelId] int  NOT NULL
);
GO

-- Creating table 'AspNetUserRoles'
CREATE TABLE [dbo].[AspNetUserRoles] (
    [AspNetRoles_Id] int  NOT NULL,
    [AspNetUsers_Id] int  NOT NULL
);
GO

-- Creating table 'EmailAssignedRights'
CREATE TABLE [dbo].[EmailAssignedRights] (
    [Emails_Id] int  NOT NULL,
    [EmailRights_Id] int  NOT NULL
);
GO

-- Creating table 'MediaNewsCategories'
CREATE TABLE [dbo].[MediaNewsCategories] (
    [Categories_Id] int  NOT NULL,
    [MediaNews_Id] int  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'AspNetRoles'
ALTER TABLE [dbo].[AspNetRoles]
ADD CONSTRAINT [PK_AspNetRoles]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'AspNetUserClaims'
ALTER TABLE [dbo].[AspNetUserClaims]
ADD CONSTRAINT [PK_AspNetUserClaims]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [UserId], [LoginProvider], [ProviderKey] in table 'AspNetUserLogins'
ALTER TABLE [dbo].[AspNetUserLogins]
ADD CONSTRAINT [PK_AspNetUserLogins]
    PRIMARY KEY CLUSTERED ([UserId], [LoginProvider], [ProviderKey] ASC);
GO

-- Creating primary key on [Id] in table 'AspNetUsers'
ALTER TABLE [dbo].[AspNetUsers]
ADD CONSTRAINT [PK_AspNetUsers]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [CityId] in table 'Cities'
ALTER TABLE [dbo].[Cities]
ADD CONSTRAINT [PK_Cities]
    PRIMARY KEY CLUSTERED ([CityId] ASC);
GO

-- Creating primary key on [Id] in table 'MediaChannels'
ALTER TABLE [dbo].[MediaChannels]
ADD CONSTRAINT [PK_MediaChannels]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'MediaTypes'
ALTER TABLE [dbo].[MediaTypes]
ADD CONSTRAINT [PK_MediaTypes]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'NewsTypes'
ALTER TABLE [dbo].[NewsTypes]
ADD CONSTRAINT [PK_NewsTypes]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Sentiments'
ALTER TABLE [dbo].[Sentiments]
ADD CONSTRAINT [PK_Sentiments]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [StatusId] in table 'Status'
ALTER TABLE [dbo].[Status]
ADD CONSTRAINT [PK_Status]
    PRIMARY KEY CLUSTERED ([StatusId] ASC);
GO

-- Creating primary key on [Id] in table 'Emails'
ALTER TABLE [dbo].[Emails]
ADD CONSTRAINT [PK_Emails]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'EmailRights'
ALTER TABLE [dbo].[EmailRights]
ADD CONSTRAINT [PK_EmailRights]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [MediaNewsId] in table 'MediaNewsAttachments'
ALTER TABLE [dbo].[MediaNewsAttachments]
ADD CONSTRAINT [PK_MediaNewsAttachments]
    PRIMARY KEY CLUSTERED ([MediaNewsId] ASC);
GO

-- Creating primary key on [Id] in table 'Categories'
ALTER TABLE [dbo].[Categories]
ADD CONSTRAINT [PK_Categories]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'MediaNews'
ALTER TABLE [dbo].[MediaNews]
ADD CONSTRAINT [PK_MediaNews]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'ChannelScores'
ALTER TABLE [dbo].[ChannelScores]
ADD CONSTRAINT [PK_ChannelScores]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [AspNetRoles_Id], [AspNetUsers_Id] in table 'AspNetUserRoles'
ALTER TABLE [dbo].[AspNetUserRoles]
ADD CONSTRAINT [PK_AspNetUserRoles]
    PRIMARY KEY CLUSTERED ([AspNetRoles_Id], [AspNetUsers_Id] ASC);
GO

-- Creating primary key on [Emails_Id], [EmailRights_Id] in table 'EmailAssignedRights'
ALTER TABLE [dbo].[EmailAssignedRights]
ADD CONSTRAINT [PK_EmailAssignedRights]
    PRIMARY KEY CLUSTERED ([Emails_Id], [EmailRights_Id] ASC);
GO

-- Creating primary key on [Categories_Id], [MediaNews_Id] in table 'MediaNewsCategories'
ALTER TABLE [dbo].[MediaNewsCategories]
ADD CONSTRAINT [PK_MediaNewsCategories]
    PRIMARY KEY CLUSTERED ([Categories_Id], [MediaNews_Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [UserId] in table 'AspNetUserClaims'
ALTER TABLE [dbo].[AspNetUserClaims]
ADD CONSTRAINT [FK_dbo_AspNetUserClaims_dbo_AspNetUsers_UserId]
    FOREIGN KEY ([UserId])
    REFERENCES [dbo].[AspNetUsers]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_dbo_AspNetUserClaims_dbo_AspNetUsers_UserId'
CREATE INDEX [IX_FK_dbo_AspNetUserClaims_dbo_AspNetUsers_UserId]
ON [dbo].[AspNetUserClaims]
    ([UserId]);
GO

-- Creating foreign key on [UserId] in table 'AspNetUserLogins'
ALTER TABLE [dbo].[AspNetUserLogins]
ADD CONSTRAINT [FK_dbo_AspNetUserLogins_dbo_AspNetUsers_UserId]
    FOREIGN KEY ([UserId])
    REFERENCES [dbo].[AspNetUsers]
        ([Id])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- Creating foreign key on [MediaTypeId] in table 'MediaChannels'
ALTER TABLE [dbo].[MediaChannels]
ADD CONSTRAINT [FK_MediaChannels_MediaType]
    FOREIGN KEY ([MediaTypeId])
    REFERENCES [dbo].[MediaTypes]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_MediaChannels_MediaType'
CREATE INDEX [IX_FK_MediaChannels_MediaType]
ON [dbo].[MediaChannels]
    ([MediaTypeId]);
GO

-- Creating foreign key on [MediaTypeId] in table 'NewsTypes'
ALTER TABLE [dbo].[NewsTypes]
ADD CONSTRAINT [FK_MediaType_NewsType]
    FOREIGN KEY ([MediaTypeId])
    REFERENCES [dbo].[MediaTypes]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_MediaType_NewsType'
CREATE INDEX [IX_FK_MediaType_NewsType]
ON [dbo].[NewsTypes]
    ([MediaTypeId]);
GO

-- Creating foreign key on [AspNetRoles_Id] in table 'AspNetUserRoles'
ALTER TABLE [dbo].[AspNetUserRoles]
ADD CONSTRAINT [FK_AspNetUserRoles_AspNetRole]
    FOREIGN KEY ([AspNetRoles_Id])
    REFERENCES [dbo].[AspNetRoles]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating foreign key on [AspNetUsers_Id] in table 'AspNetUserRoles'
ALTER TABLE [dbo].[AspNetUserRoles]
ADD CONSTRAINT [FK_AspNetUserRoles_AspNetUser]
    FOREIGN KEY ([AspNetUsers_Id])
    REFERENCES [dbo].[AspNetUsers]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_AspNetUserRoles_AspNetUser'
CREATE INDEX [IX_FK_AspNetUserRoles_AspNetUser]
ON [dbo].[AspNetUserRoles]
    ([AspNetUsers_Id]);
GO

-- Creating foreign key on [Emails_Id] in table 'EmailAssignedRights'
ALTER TABLE [dbo].[EmailAssignedRights]
ADD CONSTRAINT [FK_EmailAssignedRights_Email]
    FOREIGN KEY ([Emails_Id])
    REFERENCES [dbo].[Emails]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating foreign key on [EmailRights_Id] in table 'EmailAssignedRights'
ALTER TABLE [dbo].[EmailAssignedRights]
ADD CONSTRAINT [FK_EmailAssignedRights_EmailRight]
    FOREIGN KEY ([EmailRights_Id])
    REFERENCES [dbo].[EmailRights]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_EmailAssignedRights_EmailRight'
CREATE INDEX [IX_FK_EmailAssignedRights_EmailRight]
ON [dbo].[EmailAssignedRights]
    ([EmailRights_Id]);
GO

-- Creating foreign key on [CreatedBy] in table 'MediaNews'
ALTER TABLE [dbo].[MediaNews]
ADD CONSTRAINT [FK_MediaNews_AspNetUsers_CreatedBy]
    FOREIGN KEY ([CreatedBy])
    REFERENCES [dbo].[AspNetUsers]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_MediaNews_AspNetUsers_CreatedBy'
CREATE INDEX [IX_FK_MediaNews_AspNetUsers_CreatedBy]
ON [dbo].[MediaNews]
    ([CreatedBy]);
GO

-- Creating foreign key on [UpdatedBy] in table 'MediaNews'
ALTER TABLE [dbo].[MediaNews]
ADD CONSTRAINT [FK_MediaNews_AspNetUsersUpdatedBy]
    FOREIGN KEY ([UpdatedBy])
    REFERENCES [dbo].[AspNetUsers]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_MediaNews_AspNetUsersUpdatedBy'
CREATE INDEX [IX_FK_MediaNews_AspNetUsersUpdatedBy]
ON [dbo].[MediaNews]
    ([UpdatedBy]);
GO

-- Creating foreign key on [CityId] in table 'MediaNews'
ALTER TABLE [dbo].[MediaNews]
ADD CONSTRAINT [FK_MediaNews_City]
    FOREIGN KEY ([CityId])
    REFERENCES [dbo].[Cities]
        ([CityId])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_MediaNews_City'
CREATE INDEX [IX_FK_MediaNews_City]
ON [dbo].[MediaNews]
    ([CityId]);
GO

-- Creating foreign key on [ChannelId] in table 'MediaNews'
ALTER TABLE [dbo].[MediaNews]
ADD CONSTRAINT [FK_MediaNews_MediaChannels]
    FOREIGN KEY ([ChannelId])
    REFERENCES [dbo].[MediaChannels]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_MediaNews_MediaChannels'
CREATE INDEX [IX_FK_MediaNews_MediaChannels]
ON [dbo].[MediaNews]
    ([ChannelId]);
GO

-- Creating foreign key on [MediaTypeId] in table 'MediaNews'
ALTER TABLE [dbo].[MediaNews]
ADD CONSTRAINT [FK_MediaNews_MediaType]
    FOREIGN KEY ([MediaTypeId])
    REFERENCES [dbo].[MediaTypes]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_MediaNews_MediaType'
CREATE INDEX [IX_FK_MediaNews_MediaType]
ON [dbo].[MediaNews]
    ([MediaTypeId]);
GO

-- Creating foreign key on [NewsTypeId] in table 'MediaNews'
ALTER TABLE [dbo].[MediaNews]
ADD CONSTRAINT [FK_MediaNews_NewsType]
    FOREIGN KEY ([NewsTypeId])
    REFERENCES [dbo].[NewsTypes]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_MediaNews_NewsType'
CREATE INDEX [IX_FK_MediaNews_NewsType]
ON [dbo].[MediaNews]
    ([NewsTypeId]);
GO

-- Creating foreign key on [SentimentId] in table 'MediaNews'
ALTER TABLE [dbo].[MediaNews]
ADD CONSTRAINT [FK_MediaNews_Sentiments]
    FOREIGN KEY ([SentimentId])
    REFERENCES [dbo].[Sentiments]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_MediaNews_Sentiments'
CREATE INDEX [IX_FK_MediaNews_Sentiments]
ON [dbo].[MediaNews]
    ([SentimentId]);
GO

-- Creating foreign key on [StatusId] in table 'MediaNews'
ALTER TABLE [dbo].[MediaNews]
ADD CONSTRAINT [FK_MediaNews_Status]
    FOREIGN KEY ([StatusId])
    REFERENCES [dbo].[Status]
        ([StatusId])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_MediaNews_Status'
CREATE INDEX [IX_FK_MediaNews_Status]
ON [dbo].[MediaNews]
    ([StatusId]);
GO

-- Creating foreign key on [Categories_Id] in table 'MediaNewsCategories'
ALTER TABLE [dbo].[MediaNewsCategories]
ADD CONSTRAINT [FK_MediaNewsCategories_Category]
    FOREIGN KEY ([Categories_Id])
    REFERENCES [dbo].[Categories]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating foreign key on [MediaNews_Id] in table 'MediaNewsCategories'
ALTER TABLE [dbo].[MediaNewsCategories]
ADD CONSTRAINT [FK_MediaNewsCategories_MediaNew]
    FOREIGN KEY ([MediaNews_Id])
    REFERENCES [dbo].[MediaNews]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_MediaNewsCategories_MediaNew'
CREATE INDEX [IX_FK_MediaNewsCategories_MediaNew]
ON [dbo].[MediaNewsCategories]
    ([MediaNews_Id]);
GO

-- Creating foreign key on [NewsTypeId] in table 'ChannelScores'
ALTER TABLE [dbo].[ChannelScores]
ADD CONSTRAINT [FK_ChannelScores_NewsType]
    FOREIGN KEY ([NewsTypeId])
    REFERENCES [dbo].[NewsTypes]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_ChannelScores_NewsType'
CREATE INDEX [IX_FK_ChannelScores_NewsType]
ON [dbo].[ChannelScores]
    ([NewsTypeId]);
GO

-- Creating foreign key on [SentimentId] in table 'ChannelScores'
ALTER TABLE [dbo].[ChannelScores]
ADD CONSTRAINT [FK_ChannelScores_Sentiments]
    FOREIGN KEY ([SentimentId])
    REFERENCES [dbo].[Sentiments]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_ChannelScores_Sentiments'
CREATE INDEX [IX_FK_ChannelScores_Sentiments]
ON [dbo].[ChannelScores]
    ([SentimentId]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------