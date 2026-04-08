USE [Indef_Clone]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- ============================================================
-- 1. Main Table - ABP Register
-- ============================================================
CREATE TABLE [dbo].[tbl_ABP_Register](
	[ABP_ID] [int] IDENTITY(1,1) NOT NULL,

	-- Firm & Initiator Info
	[Firm_Name] [varchar](500) NULL,
	[Constitution] [varchar](200) NULL,
	[Initiator_RSM_Name] [varchar](200) NULL,
	[Initiator_RSM_Region] [varchar](200) NULL,

	-- Contact Person
	[Contact_Person_Name] [varchar](200) NULL,
	[Contact_Person_Designation] [varchar](200) NULL,
	[Contact_Person_Firm_Exp] [varchar](200) NULL,
	[Contact_Person_Total_Exp] [int] NULL,
	[Contact_Person_Tele_Num] [varchar](50) NULL,
	[Contact_Person_Mob_Num] [varchar](50) NULL,
	[Contact_Person_Email] [varchar](200) NULL,

	-- Sales Personnel
	[Sales_Personnel_Num] [int] NULL,
	[Sales_Personnel_Avg_Exp] [decimal](18,2) NULL,
	[Sales_Personnel_Attachment_Path] [nvarchar](500) NULL,
	[Sales_Personnel_Attachment_Name] [nvarchar](255) NULL,
	[Sales_Personnel_Attachment_Type] [varchar](50) NULL,

	-- Business Development Personnel
	[Business_Dev_Personnel_Num] [int] NULL,
	[Business_Dev_Personnel_Avg_Exp] [decimal](18,2) NULL,
	[Business_Dev_Personnel_Attachment_Path] [nvarchar](500) NULL,
	[Business_Dev_Personnel_Attachment_Name] [nvarchar](255) NULL,
	[Business_Dev_Personnel_Attachment_Type] [varchar](50) NULL,

	-- Service Personnel
	[Service_Personnel_Num] [int] NULL,
	[Service_Personnel_Avg_Exp] [decimal](18,2) NULL,
	[Service_Personnel_Attachment_Path] [nvarchar](500) NULL,
	[Service_Personnel_Attachment_Name] [nvarchar](255) NULL,
	[Service_Personnel_Attachment_Type] [varchar](50) NULL,

	-- Sales Promotion Activities
	[Sales_Promotion_Act] [nvarchar](1000) NULL,
	[Sales_Promotion_Act_Attachment_Path] [nvarchar](500) NULL,
	[Sales_Promotion_Act_Attachment_Name] [nvarchar](255) NULL,
	[Sales_Promotion_Act_Attachment_Type] [varchar](50) NULL,

	-- Tools & Tackles for Service
	[Tools_Tackles_For_Service] [nvarchar](1000) NULL,
	[Tools_Tackles_For_Service_Attachment_Path] [nvarchar](500) NULL,
	[Tools_Tackles_For_Service_Attachment_Name] [nvarchar](255) NULL,
	[Tools_Tackles_For_Service_Attachment_Type] [varchar](50) NULL,

	-- Business Details
	[Nature_Of_Business] [nvarchar](500) NULL,
	[Num_Of_Subdealers] [varchar](200) NULL,
	[Product_Dealt_With] [nvarchar](1000) NULL,

	[Industries_Served] [nvarchar](1000) NULL,
	[Industries_Served_Attachment_Path] [nvarchar](500) NULL,
	[Industries_Served_Attachment_Name] [nvarchar](255) NULL,
	[Industries_Served_Attachment_Type] [varchar](50) NULL,

	[Key_Customers] [nvarchar](1000) NULL,
	[Key_Customers_Attachment_Path] [nvarchar](500) NULL,
	[Key_Customers_Attachment_Name] [nvarchar](255) NULL,
	[Key_Customers_Attachment_Type] [varchar](50) NULL,

	[Geographical_Coverage] [nvarchar](1000) NULL,
	[Geographical_Coverage_Attachment_Path] [nvarchar](500) NULL,
	[Geographical_Coverage_Attachment_Name] [nvarchar](255) NULL,
	[Geographical_Coverage_Attachment_Type] [varchar](50) NULL,

	[Distributorship_Details] [nvarchar](1000) NULL,
	[Distributorship_Details_Attachment_Path] [nvarchar](500) NULL,
	[Distributorship_Details_Attachment_Name] [nvarchar](255) NULL,
	[Distributorship_Details_Attachment_Type] [varchar](50) NULL,

	-- Financial Details
	[Firm_Networth] [decimal](18,2) NULL,
	[Principals_Networth] [decimal](18,2) NULL,
	[Secured_Debt] [decimal](18,2) NULL,
	[Unsecured_Debt] [decimal](18,2) NULL,
	[PAN_Num] [varchar](20) NULL,
	[GST_Reg_Num] [varchar](50) NULL,
	[Bank_Facility] [varchar](500) NULL,
	[Rate_Of_Int] [decimal](18,2) NULL,
	[Bank_Name] [varchar](500) NULL,
	[Bank_Add] [nvarchar](1000) NULL,
	[Latest_Credit_Rating] [varchar](200) NULL,
	[Last_Limit_Renewal_Date] [datetime] NULL,

	-- Financial Attachments
	[Balance_Sheet_Attachment_Path] [nvarchar](500) NULL,
	[Balance_Sheet_Attachment_Name] [nvarchar](255) NULL,
	[Balance_Sheet_Attachment_Type] [varchar](50) NULL,

	[Prof_Loss_Acc_Attachment_Path] [nvarchar](500) NULL,
	[Prof_Loss_Acc_Attachment_Name] [nvarchar](255) NULL,
	[Prof_Loss_Acc_Attachment_Type] [varchar](50) NULL,

	[Cash_Flow_Stat_Attachment_Path] [nvarchar](500) NULL,
	[Cash_Flow_Stat_Attachment_Name] [nvarchar](255) NULL,
	[Cash_Flow_Stat_Attachment_Type] [varchar](50) NULL,

	[PAN_Card_Attachment_Path] [nvarchar](500) NULL,
	[PAN_Card_Attachment_Name] [nvarchar](255) NULL,
	[PAN_Card_Attachment_Type] [varchar](50) NULL,

	[ITR_Attachment_Path] [nvarchar](500) NULL,
	[ITR_Attachment_Name] [nvarchar](255) NULL,
	[ITR_Attachment_Type] [varchar](50) NULL,

	[GST_Reg_Attachment_Path] [nvarchar](500) NULL,
	[GST_Reg_Attachment_Name] [nvarchar](255) NULL,
	[GST_Reg_Attachment_Type] [varchar](50) NULL,

	[GST_Return_Audit_Attachment_Path] [nvarchar](500) NULL,
	[GST_Return_Audit_Attachment_Name] [nvarchar](255) NULL,
	[GST_Return_Audit_Attachment_Type] [varchar](50) NULL,

	-- MD Approval
	[MD_Status] [varchar](20) NULL,
	[MD_Comments] [nvarchar](1000) NULL,

	-- Audit Fields
	[Created_On] [datetime] NULL,
	[Created_By] [int] NULL,
	[Modified_On] [datetime] NULL,
	[Modified_By] [int] NULL,
	[Active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[ABP_ID] ASC
) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[tbl_ABP_Register] ADD DEFAULT (GETDATE()) FOR [Created_On]
GO
ALTER TABLE [dbo].[tbl_ABP_Register] ADD DEFAULT ((1)) FOR [Active]
GO


-- ============================================================
-- 2. Principal Details Table
-- ============================================================
CREATE TABLE [dbo].[tbl_ABP_Principal_Details](
	[Principal_Detail_ID] [int] IDENTITY(1,1) NOT NULL,
	[ABP_ID] [int] NULL,
	[Designation] [varchar](200) NULL,
	[Full_Name] [varchar](200) NULL,
	[Tele_Num] [varchar](50) NULL,
	[Mob_Num] [varchar](50) NULL,
	[Email] [varchar](200) NULL,
	[Yrs_In_Business] [int] NULL,
	[Existing_Business_Exp] [nvarchar](1000) NULL,
	[Past_Business_Exp] [nvarchar](1000) NULL,
	[Succession_Plan] [nvarchar](1000) NULL,

	-- Audit Fields
	[Created_On] [datetime] NULL,
	[Created_By] [int] NULL,
	[Modified_On] [datetime] NULL,
	[Modified_By] [int] NULL,
	[Active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[Principal_Detail_ID] ASC
) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[tbl_ABP_Principal_Details] ADD DEFAULT (GETDATE()) FOR [Created_On]
GO
ALTER TABLE [dbo].[tbl_ABP_Principal_Details] ADD DEFAULT ((1)) FOR [Active]
GO


-- ============================================================
-- 3. Office Location Table
-- ============================================================
CREATE TABLE [dbo].[tbl_ABP_Office_Location](
	[Office_Detail_ID] [int] IDENTITY(1,1) NOT NULL,
	[ABP_ID] [int] NULL,

	-- Office Details
	[Office_Address] [nvarchar](1000) NULL,
	[Office_City] [varchar](200) NULL,
	[Office_Area_Sqft] [decimal](18,2) NULL,

	-- Godown Details
	[Godown_Address] [nvarchar](1000) NULL,
	[Godown_City] [varchar](200) NULL,
	[Godown_Area_Sqft] [decimal](18,2) NULL,

	-- Service Location Details
	[Service_Location] [nvarchar](1000) NULL,
	[Service_Area_Sqft] [decimal](18,2) NULL,

	-- Audit Fields
	[Created_On] [datetime] NULL,
	[Created_By] [int] NULL,
	[Modified_On] [datetime] NULL,
	[Modified_By] [int] NULL,
	[Active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[Office_Detail_ID] ASC
) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[tbl_ABP_Office_Location] ADD DEFAULT (GETDATE()) FOR [Created_On]
GO
ALTER TABLE [dbo].[tbl_ABP_Office_Location] ADD DEFAULT ((1)) FOR [Active]
GO


-- ============================================================
-- 4. ABP Assessment / Ratings Table
-- ============================================================
CREATE TABLE [dbo].[tbl_ABP_Assessment](
	[ABP_Assessment_ID] [int] IDENTITY(1,1) NOT NULL,
	[ABP_ID] [int] NULL,
	[Assessment_Type] [varchar](100) NULL,

	-- Ratings & Remarks
	[ABP_Location_Rating] [int] NULL,
	[ABP_Location_Remarks] [nvarchar](1000) NULL,
	[Type_Of_Industries_Covered_Rating] [int] NULL,
	[Type_Of_Industries_Covered_Remarks] [nvarchar](1000) NULL,
	[Product_Representing_Rating] [int] NULL,
	[Product_Representing_Remarks] [nvarchar](1000) NULL,
	[Geographical_Coverage_Rating] [int] NULL,
	[Geographical_Coverage_Remarks] [nvarchar](1000) NULL,
	[Number_Of_Retailers_Rating] [int] NULL,
	[Number_Of_Retailers_Remarks] [nvarchar](1000) NULL,
	[Team_Size_Capability_Rating] [int] NULL,
	[Team_Size_Capability_Remarks] [nvarchar](1000) NULL,
	[Service_Supprt_Infrastructure_Rating] [int] NULL,
	[Service_Supprt_Infrastructure_Remarks] [nvarchar](1000) NULL,
	[Financial_Viability_Rating] [int] NULL,
	[Financial_Viability_Remarks] [nvarchar](1000) NULL,

	-- Expected OI
	[Curr_Yr_Expected_OI] [decimal](18,2) NULL,
	[Next_Yr_Expected_OI] [decimal](18,2) NULL,
	[Next_To_Next_Yr_Expected_OI] [decimal](18,2) NULL,

	-- SWOT & Recommendations
	[Strength] [nvarchar](2000) NULL,
	[Weakness] [nvarchar](2000) NULL,
	[Area_Of_Support_Req] [nvarchar](2000) NULL,
	[Comments_Recommendation] [nvarchar](2000) NULL,

	-- Audit Fields
	[Created_On] [datetime] NULL,
	[Created_By] [int] NULL,
	[Modified_On] [datetime] NULL,
	[Modified_By] [int] NULL,
	[Active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[ABP_Assessment_ID] ASC
) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[tbl_ABP_Assessment] ADD DEFAULT (GETDATE()) FOR [Created_On]
GO
ALTER TABLE [dbo].[tbl_ABP_Assessment] ADD DEFAULT ((1)) FOR [Active]
GO


-- ============================================================
-- 5. 100 Days Onboarding Plan Table
-- ============================================================
CREATE TABLE [dbo].[tbl_ABP_100Days_Plan](
	[Onboarding_Plan_ID] [int] IDENTITY(1,1) NOT NULL,
	[ABP_ID] [int] NULL,
	[Start_Plan_Date] [datetime] NULL,

	-- Sign Onboarding
	[Sign_Onboarding_Status] [bit] NULL,
	[Sign_Onboarding_Completed_By] [int] NULL,
	[Sign_Onboarding_Completed_On] [datetime] NULL,
	[Sign_Onboarding_Completion_Remarks] [nvarchar](1000) NULL,

	-- ABP Appointment
	[ABP_Appointment_Status] [bit] NULL,
	[ABP_Appointment_Completed_By] [int] NULL,
	[ABP_Appointment_Completed_On] [datetime] NULL,
	[ABP_Appointment_Completion_Remarks] [nvarchar](1000) NULL,

	-- Dedicated BD Calling
	[Dedicated_BD_Calling_Status] [bit] NULL,
	[Dedicated_BD_Calling_Completed_By] [int] NULL,
	[Dedicated_BD_Calling_Completed_On] [datetime] NULL,
	[Dedicated_BD_Calling_Completion_Remarks] [nvarchar](1000) NULL,

	-- ABP Training
	[ABP_Training_Status] [bit] NULL,
	[ABP_Training_Completed_By] [int] NULL,
	[ABP_Training_Completed_On] [datetime] NULL,
	[ABP_Training_Completion_Remarks] [nvarchar](1000) NULL,

	-- Factory Visit Date
	[Factory_Visit_Date] [datetime] NULL,
	[Factory_Visit_Date_Updated_By] [int] NULL,
	[Factory_Visit_Date_Updated_On] [datetime] NULL,

	-- Technical Training (base + 1 through 8)
	[Technical_Training_Status] [bit] NULL,
	[Technical_Training_Completed_By] [int] NULL,
	[Technical_Training_Completed_On] [datetime] NULL,
	[Technical_Training_Completion_Remarks] [nvarchar](1000) NULL,

	[Induction_With_Design_Team_Status] [bit] NULL,
	[Induction_With_Design_Team_Completed_By] [int] NULL,
	[Induction_With_Design_Team_Completed_On] [datetime] NULL,
	[Induction_With_Design_Team_Completion_Remarks] [nvarchar](1000) NULL,

	[Technical_Training_One_Status] [bit] NULL,
	[Technical_Training_One_Completed_By] [int] NULL,
	[Technical_Training_One_Completed_On] [datetime] NULL,
	[Technical_Training_One_Completion_Remarks] [nvarchar](1000) NULL,

	[Technical_Training_Two_Status] [bit] NULL,
	[Technical_Training_Two_Completed_By] [int] NULL,
	[Technical_Training_Two_Completed_On] [datetime] NULL,
	[Technical_Training_Two_Completion_Remarks] [nvarchar](1000) NULL,

	[Technical_Training_Three_Status] [bit] NULL,
	[Technical_Training_Three_Completed_By] [int] NULL,
	[Technical_Training_Three_Completed_On] [datetime] NULL,
	[Technical_Training_Three_Completion_Remarks] [nvarchar](1000) NULL,

	[Technical_Training_Four_Status] [bit] NULL,
	[Technical_Training_Four_Completed_By] [int] NULL,
	[Technical_Training_Four_Completed_On] [datetime] NULL,
	[Technical_Training_Four_Completion_Remarks] [nvarchar](1000) NULL,

	[Technical_Training_Five_Status] [bit] NULL,
	[Technical_Training_Five_Completed_By] [int] NULL,
	[Technical_Training_Five_Completed_On] [datetime] NULL,
	[Technical_Training_Five_Completion_Remarks] [nvarchar](1000) NULL,

	[Technical_Training_Six_Status] [bit] NULL,
	[Technical_Training_Six_Completed_By] [int] NULL,
	[Technical_Training_Six_Completed_On] [datetime] NULL,
	[Technical_Training_Six_Completion_Remarks] [nvarchar](1000) NULL,

	[Technical_Training_Seven_Status] [bit] NULL,
	[Technical_Training_Seven_Completed_By] [int] NULL,
	[Technical_Training_Seven_Completed_On] [datetime] NULL,
	[Technical_Training_Seven_Completion_Remarks] [nvarchar](1000) NULL,

	[Technical_Training_Eight_Status] [bit] NULL,
	[Technical_Training_Eight_Completed_By] [int] NULL,
	[Technical_Training_Eight_Completed_On] [datetime] NULL,
	[Technical_Training_Eight_Completion_Remarks] [nvarchar](1000) NULL,

	-- Industry Information (base + 1 through 7)
	[Industry_Information_Status] [bit] NULL,
	[Industry_Information_Completed_By] [int] NULL,
	[Industry_Information_Completed_On] [datetime] NULL,
	[Industry_Information_Completion_Remarks] [nvarchar](1000) NULL,

	[Industry_Information_One_Status] [bit] NULL,
	[Industry_Information_One_Completed_By] [int] NULL,
	[Industry_Information_One_Completed_On] [datetime] NULL,
	[Industry_Information_One_Completion_Remarks] [nvarchar](1000) NULL,

	[Industry_Information_Two_Status] [bit] NULL,
	[Industry_Information_Two_Completed_By] [int] NULL,
	[Industry_Information_Two_Completed_On] [datetime] NULL,
	[Industry_Information_Two_Completion_Remarks] [nvarchar](1000) NULL,

	[Industry_Information_Three_Status] [bit] NULL,
	[Industry_Information_Three_Completed_By] [int] NULL,
	[Industry_Information_Three_Completed_On] [datetime] NULL,
	[Industry_Information_Three_Completion_Remarks] [nvarchar](1000) NULL,

	[Industry_Information_Four_Status] [bit] NULL,
	[Industry_Information_Four_Completed_By] [int] NULL,
	[Industry_Information_Four_Completed_On] [datetime] NULL,
	[Industry_Information_Four_Completion_Remarks] [nvarchar](1000) NULL,

	[Industry_Information_Five_Status] [bit] NULL,
	[Industry_Information_Five_Completed_By] [int] NULL,
	[Industry_Information_Five_Completed_On] [datetime] NULL,
	[Industry_Information_Five_Completion_Remarks] [nvarchar](1000) NULL,

	[Industry_Information_Six_Status] [bit] NULL,
	[Industry_Information_Six_Completed_By] [int] NULL,
	[Industry_Information_Six_Completed_On] [datetime] NULL,
	[Industry_Information_Six_Completion_Remarks] [nvarchar](1000) NULL,

	[Industry_Information_Seven_Status] [bit] NULL,
	[Industry_Information_Seven_Completed_By] [int] NULL,
	[Industry_Information_Seven_Completed_On] [datetime] NULL,
	[Industry_Information_Seven_Completion_Remarks] [nvarchar](1000) NULL,

	-- Factory Visit (base + 1 through 5)
	[Factory_Visit_Status] [bit] NULL,
	[Factory_Visit_Completed_By] [int] NULL,
	[Factory_Visit_Completed_On] [datetime] NULL,
	[Factory_Visit_Completion_Remarks] [nvarchar](1000) NULL,

	[Factory_Visit_One_Status] [bit] NULL,
	[Factory_Visit_One_Completed_By] [int] NULL,
	[Factory_Visit_One_Completed_On] [datetime] NULL,
	[Factory_Visit_One_Completion_Remarks] [nvarchar](1000) NULL,

	[Factory_Visit_Two_Status] [bit] NULL,
	[Factory_Visit_Two_Completed_By] [int] NULL,
	[Factory_Visit_Two_Completed_On] [datetime] NULL,
	[Factory_Visit_Two_Completion_Remarks] [nvarchar](1000) NULL,

	[Factory_Visit_Three_Status] [bit] NULL,
	[Factory_Visit_Three_Completed_By] [int] NULL,
	[Factory_Visit_Three_Completed_On] [datetime] NULL,
	[Factory_Visit_Three_Completion_Remarks] [nvarchar](1000) NULL,

	[Factory_Visit_Four_Status] [bit] NULL,
	[Factory_Visit_Four_Completed_By] [int] NULL,
	[Factory_Visit_Four_Completed_On] [datetime] NULL,
	[Factory_Visit_Four_Completion_Remarks] [nvarchar](1000) NULL,

	[Factory_Visit_Five_Status] [bit] NULL,
	[Factory_Visit_Five_Completed_By] [int] NULL,
	[Factory_Visit_Five_Completed_On] [datetime] NULL,
	[Factory_Visit_Five_Completion_Remarks] [nvarchar](1000) NULL,

	-- Process Training (base + 1 through 10)
	[Process_Training_Status] [bit] NULL,
	[Process_Training_Completed_By] [int] NULL,
	[Process_Training_Completed_On] [datetime] NULL,
	[Process_Training_Completion_Remarks] [nvarchar](1000) NULL,

	[Process_Training_One_Status] [bit] NULL,
	[Process_Training_One_Completed_By] [int] NULL,
	[Process_Training_One_Completed_On] [datetime] NULL,
	[Process_Training_One_Completion_Remarks] [nvarchar](1000) NULL,

	[Process_Training_Two_Status] [bit] NULL,
	[Process_Training_Two_Completed_By] [int] NULL,
	[Process_Training_Two_Completed_On] [datetime] NULL,
	[Process_Training_Two_Completion_Remarks] [nvarchar](1000) NULL,

	[Process_Training_Three_Status] [bit] NULL,
	[Process_Training_Three_Completed_By] [int] NULL,
	[Process_Training_Three_Completed_On] [datetime] NULL,
	[Process_Training_Three_Completion_Remarks] [nvarchar](1000) NULL,

	[Process_Training_Four_Status] [bit] NULL,
	[Process_Training_Four_Completed_By] [int] NULL,
	[Process_Training_Four_Completed_On] [datetime] NULL,
	[Process_Training_Four_Completion_Remarks] [nvarchar](1000) NULL,

	[Process_Training_Five_Status] [bit] NULL,
	[Process_Training_Five_Completed_By] [int] NULL,
	[Process_Training_Five_Completed_On] [datetime] NULL,
	[Process_Training_Five_Completion_Remarks] [nvarchar](1000) NULL,

	[Process_Training_Six_Status] [bit] NULL,
	[Process_Training_Six_Completed_By] [int] NULL,
	[Process_Training_Six_Completed_On] [datetime] NULL,
	[Process_Training_Six_Completion_Remarks] [nvarchar](1000) NULL,

	[Process_Training_Seven_Status] [bit] NULL,
	[Process_Training_Seven_Completed_By] [int] NULL,
	[Process_Training_Seven_Completed_On] [datetime] NULL,
	[Process_Training_Seven_Completion_Remarks] [nvarchar](1000) NULL,

	[Process_Training_Eight_Status] [bit] NULL,
	[Process_Training_Eight_Completed_By] [int] NULL,
	[Process_Training_Eight_Completed_On] [datetime] NULL,
	[Process_Training_Eight_Completion_Remarks] [nvarchar](1000) NULL,

	[Process_Training_Nine_Status] [bit] NULL,
	[Process_Training_Nine_Completed_By] [int] NULL,
	[Process_Training_Nine_Completed_On] [datetime] NULL,
	[Process_Training_Nine_Completion_Remarks] [nvarchar](1000) NULL,

	[Process_Training_Ten_Status] [bit] NULL,
	[Process_Training_Ten_Completed_By] [int] NULL,
	[Process_Training_Ten_Completed_On] [datetime] NULL,
	[Process_Training_Ten_Completion_Remarks] [nvarchar](1000) NULL,

	-- Interface Training (base + 1 through 6)
	[Interface_Training_Status] [bit] NULL,
	[Interface_Training_Completed_By] [int] NULL,
	[Interface_Training_Completed_On] [datetime] NULL,
	[Interface_Training_Completion_Remarks] [nvarchar](1000) NULL,

	[Interface_Training_One_Status] [bit] NULL,
	[Interface_Training_One_Completed_By] [int] NULL,
	[Interface_Training_One_Completed_On] [datetime] NULL,
	[Interface_Training_One_Completion_Remarks] [nvarchar](1000) NULL,

	[Interface_Training_Two_Status] [bit] NULL,
	[Interface_Training_Two_Completed_By] [int] NULL,
	[Interface_Training_Two_Completed_On] [datetime] NULL,
	[Interface_Training_Two_Completion_Remarks] [nvarchar](1000) NULL,

	[Interface_Training_Three_Status] [bit] NULL,
	[Interface_Training_Three_Completed_By] [int] NULL,
	[Interface_Training_Three_Completed_On] [datetime] NULL,
	[Interface_Training_Three_Completion_Remarks] [nvarchar](1000) NULL,

	[Interface_Training_Four_Status] [bit] NULL,
	[Interface_Training_Four_Completed_By] [int] NULL,
	[Interface_Training_Four_Completed_On] [datetime] NULL,
	[Interface_Training_Four_Completion_Remarks] [nvarchar](1000) NULL,

	[Interface_Training_Five_Status] [bit] NULL,
	[Interface_Training_Five_Completed_By] [int] NULL,
	[Interface_Training_Five_Completed_On] [datetime] NULL,
	[Interface_Training_Five_Completion_Remarks] [nvarchar](1000) NULL,

	[Interface_Training_Six_Status] [bit] NULL,
	[Interface_Training_Six_Completed_By] [int] NULL,
	[Interface_Training_Six_Completed_On] [datetime] NULL,
	[Interface_Training_Six_Completion_Remarks] [nvarchar](1000) NULL,

	-- Welcome Kit (base + 1 through 11)
	[Welcome_Kit_Status] [bit] NULL,
	[Welcome_Kit_Completed_By] [int] NULL,
	[Welcome_Kit_Completed_On] [datetime] NULL,
	[Welcome_Kit_Completion_Remarks] [nvarchar](1000) NULL,

	[Welcome_Kit_One_Status] [bit] NULL,
	[Welcome_Kit_One_Completed_By] [int] NULL,
	[Welcome_Kit_One_Completed_On] [datetime] NULL,
	[Welcome_Kit_One_Completion_Remarks] [nvarchar](1000) NULL,

	[Welcome_Kit_Two_Status] [bit] NULL,
	[Welcome_Kit_Two_Completed_By] [int] NULL,
	[Welcome_Kit_Two_Completed_On] [datetime] NULL,
	[Welcome_Kit_Two_Completion_Remarks] [nvarchar](1000) NULL,

	[Welcome_Kit_Three_Status] [bit] NULL,
	[Welcome_Kit_Three_Completed_By] [int] NULL,
	[Welcome_Kit_Three_Completed_On] [datetime] NULL,
	[Welcome_Kit_Three_Completion_Remarks] [nvarchar](1000) NULL,

	[Welcome_Kit_Four_Status] [bit] NULL,
	[Welcome_Kit_Four_Completed_By] [int] NULL,
	[Welcome_Kit_Four_Completed_On] [datetime] NULL,
	[Welcome_Kit_Four_Completion_Remarks] [nvarchar](1000) NULL,

	[Welcome_Kit_Five_Status] [bit] NULL,
	[Welcome_Kit_Five_Completed_By] [int] NULL,
	[Welcome_Kit_Five_Completed_On] [datetime] NULL,
	[Welcome_Kit_Five_Completion_Remarks] [nvarchar](1000) NULL,

	[Welcome_Kit_Six_Status] [bit] NULL,
	[Welcome_Kit_Six_Completed_By] [int] NULL,
	[Welcome_Kit_Six_Completed_On] [datetime] NULL,
	[Welcome_Kit_Six_Completion_Remarks] [nvarchar](1000) NULL,

	[Welcome_Kit_Seven_Status] [bit] NULL,
	[Welcome_Kit_Seven_Completed_By] [int] NULL,
	[Welcome_Kit_Seven_Completed_On] [datetime] NULL,
	[Welcome_Kit_Seven_Completion_Remarks] [nvarchar](1000) NULL,

	[Welcome_Kit_Eight_Status] [bit] NULL,
	[Welcome_Kit_Eight_Completed_By] [int] NULL,
	[Welcome_Kit_Eight_Completed_On] [datetime] NULL,
	[Welcome_Kit_Eight_Completion_Remarks] [nvarchar](1000) NULL,

	[Welcome_Kit_Nine_Status] [bit] NULL,
	[Welcome_Kit_Nine_Completed_By] [int] NULL,
	[Welcome_Kit_Nine_Completed_On] [datetime] NULL,
	[Welcome_Kit_Nine_Completion_Remarks] [nvarchar](1000) NULL,

	[Welcome_Kit_Ten_Status] [bit] NULL,
	[Welcome_Kit_Ten_Completed_By] [int] NULL,
	[Welcome_Kit_Ten_Completed_On] [datetime] NULL,
	[Welcome_Kit_Ten_Completion_Remarks] [nvarchar](1000) NULL,

	[Welcome_Kit_Eleven_Status] [bit] NULL,
	[Welcome_Kit_Eleven_Completed_By] [int] NULL,
	[Welcome_Kit_Eleven_Completed_On] [datetime] NULL,
	[Welcome_Kit_Eleven_Completion_Remarks] [nvarchar](1000) NULL,

	-- Finalizing Key Accounts
	[Finalizing_Key_Acc_Status] [bit] NULL,
	[Finalizing_Key_Acc_Completed_By] [int] NULL,
	[Finalizing_Key_Acc_Completed_On] [datetime] NULL,
	[Finalizing_Key_Acc_Completion_Remarks] [nvarchar](1000) NULL,

	-- Email Campaign
	[Email_Campaign_Status] [bit] NULL,
	[Email_Campaign_Completed_By] [int] NULL,
	[Email_Campaign_Completed_On] [datetime] NULL,
	[Email_Campaign_Completion_Remarks] [nvarchar](1000) NULL,

	-- ABP Sales Person Registration
	[ABP_Sales_Person_Registration] [bit] NULL,
	[ABP_Sales_Person_Registration_Completed_By] [int] NULL,
	[ABP_Sales_Person_Registration_Completed_On] [datetime] NULL,
	[ABP_Sales_Person_Registration_Completion_Remarks] [nvarchar](1000) NULL,

	-- Completion Training ABP Salesperson
	[Completion_Training_ABP_Salesperson_Status] [bit] NULL,
	[Completion_Training_ABP_Salesperson_Completed_By] [int] NULL,
	[Completion_Training_ABP_Salesperson_Completed_On] [datetime] NULL,
	[Completion_Training_ABP_Salesperson_Completion_Remarks] [nvarchar](1000) NULL,

	-- Sales Visit Plan
	[Sales_Visit_Plan_Status] [bit] NULL,
	[Sales_Visit_Plan_Completed_By] [int] NULL,
	[Sales_Visit_Plan_Completed_On] [datetime] NULL,
	[Sales_Visit_Plan_Completion_Remarks] [nvarchar](1000) NULL,

	-- Completion Training Service Person
	[Completion_Training_Service_Person_Status] [bit] NULL,
	[Completion_Training_Service_Person_Completed_By] [int] NULL,
	[Completion_Training_Service_Person_Completed_On] [datetime] NULL,
	[Completion_Training_Service_Person_Completion_Remarks] [nvarchar](1000) NULL,

	-- Completing Visit Key Accounts
	[Completing_Visit_Key_Acc_Status] [bit] NULL,
	[Completing_Visit_Key_Acc_Completed_By] [int] NULL,
	[Completing_Visit_Key_Acc_Completed_On] [datetime] NULL,
	[Completing_Visit_Key_Acc_Completion_Remarks] [nvarchar](1000) NULL,

	-- Key Accounts (1 through 10)
	[Key_Acc_One_Status] [bit] NULL,
	[Key_Acc_One_Completed_By] [int] NULL,
	[Key_Acc_One_Completed_On] [datetime] NULL,
	[Key_Acc_One_Completion_Remarks] [nvarchar](1000) NULL,

	[Key_Acc_Two_Status] [bit] NULL,
	[Key_Acc_Two_Completed_By] [int] NULL,
	[Key_Acc_Two_Completed_On] [datetime] NULL,
	[Key_Acc_Two_Completion_Remarks] [nvarchar](1000) NULL,

	[Key_Acc_Three_Status] [bit] NULL,
	[Key_Acc_Three_Completed_By] [int] NULL,
	[Key_Acc_Three_Completed_On] [datetime] NULL,
	[Key_Acc_Three_Completion_Remarks] [nvarchar](1000) NULL,

	[Key_Acc_Four_Status] [bit] NULL,
	[Key_Acc_Four_Completed_By] [int] NULL,
	[Key_Acc_Four_Completed_On] [datetime] NULL,
	[Key_Acc_Four_Completion_Remarks] [nvarchar](1000) NULL,

	[Key_Acc_Five_Status] [bit] NULL,
	[Key_Acc_Five_Completed_By] [int] NULL,
	[Key_Acc_Five_Completed_On] [datetime] NULL,
	[Key_Acc_Five_Completion_Remarks] [nvarchar](1000) NULL,

	[Key_Acc_Six_Status] [bit] NULL,
	[Key_Acc_Six_Completed_By] [int] NULL,
	[Key_Acc_Six_Completed_On] [datetime] NULL,
	[Key_Acc_Six_Completion_Remarks] [nvarchar](1000) NULL,

	[Key_Acc_Seven_Status] [bit] NULL,
	[Key_Acc_Seven_Completed_By] [int] NULL,
	[Key_Acc_Seven_Completed_On] [datetime] NULL,
	[Key_Acc_Seven_Completion_Remarks] [nvarchar](1000) NULL,

	[Key_Acc_Eight_Status] [bit] NULL,
	[Key_Acc_Eight_Completed_By] [int] NULL,
	[Key_Acc_Eight_Completed_On] [datetime] NULL,
	[Key_Acc_Eight_Completion_Remarks] [nvarchar](1000) NULL,

	[Key_Acc_Nine_Status] [bit] NULL,
	[Key_Acc_Nine_Completed_By] [int] NULL,
	[Key_Acc_Nine_Completed_On] [datetime] NULL,
	[Key_Acc_Nine_Completion_Remarks] [nvarchar](1000) NULL,

	[Key_Acc_Ten_Status] [bit] NULL,
	[Key_Acc_Ten_Completed_By] [int] NULL,
	[Key_Acc_Ten_Completed_On] [datetime] NULL,
	[Key_Acc_Ten_Completion_Remarks] [nvarchar](1000) NULL,

	-- Completion Setup Indef Clinic
	[Completion_Setup_Indef_Clinic_Setup] [bit] NULL,
	[Completion_Setup_Indef_Clinic_Setup_Completed_By] [int] NULL,
	[Completion_Setup_Indef_Clinic_Setup_Completed_On] [datetime] NULL,
	[Completion_Setup_Indef_Clinic_Setup_Completion_Remarks] [nvarchar](1000) NULL,

	-- Audit Fields
	[Created_On] [datetime] NULL,
	[Created_By] [int] NULL,
	[Modified_On] [datetime] NULL,
	[Modified_By] [int] NULL,
	[Active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[Onboarding_Plan_ID] ASC
) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[tbl_ABP_100Days_Plan] ADD DEFAULT (GETDATE()) FOR [Created_On]
GO
ALTER TABLE [dbo].[tbl_ABP_100Days_Plan] ADD DEFAULT ((1)) FOR [Active]
GO
