import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Shield, Building2, Target, BarChart3, Star, GraduationCap,
  ChevronRight, MapPin, Mail, Phone, Calendar, Award, Sparkles, History,
  Pencil, Trash2, Printer
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/DashboardHeader";
import { LeftSidebar } from "@/components/LeftSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProfileSectionNav } from "@/components/employee-profile/ProfileSectionNav";
import { BasicInfoPanel } from "@/components/employee-profile/panels/BasicInfoPanel";
import { PhysicalHealthPanel } from "@/components/employee-profile/panels/PhysicalHealthPanel";
import { FamilyPanel } from "@/components/employee-profile/panels/FamilyPanel";
import { ContactPanel } from "@/components/employee-profile/panels/ContactPanel";
import { LanguagesPanel } from "@/components/employee-profile/panels/LanguagesPanel";
import { AppreciationsPanel } from "@/components/employee-profile/panels/AppreciationsPanel";
import { PatentsPanel } from "@/components/employee-profile/panels/PatentsPanel";
import { GovernmentIDsPanel } from "@/components/employee-profile/panels/GovernmentIDsPanel";
import { EmployerIDsPanel } from "@/components/employee-profile/panels/EmployerIDsPanel";
import { BankAccountPanel } from "@/components/employee-profile/panels/BankAccountPanel";
import { DependentsPanel } from "@/components/employee-profile/panels/DependentsPanel";
import { NominationsPanel } from "@/components/employee-profile/panels/NominationsPanel";

import { StatutoryPanel } from "@/components/employee-profile/panels/StatutoryPanel";
import { NDAPanel } from "@/components/employee-profile/panels/NDAPanel";
import { PolicyAcknowledgmentsPanel } from "@/components/employee-profile/panels/PolicyAcknowledgmentsPanel";
import { MandatoryTrainingPanel } from "@/components/employee-profile/panels/MandatoryTrainingPanel";
import { BackgroundVerificationPanel } from "@/components/employee-profile/panels/BackgroundVerificationPanel";
import { LegalStatusPanel } from "@/components/employee-profile/panels/LegalStatusPanel";
import { AuditTrailPanel } from "@/components/employee-profile/panels/AuditTrailPanel";
import { JobTitlePanel } from "@/components/employee-profile/panels/JobTitlePanel";
import { JobGradePanel } from "@/components/employee-profile/panels/JobGradePanel";
import { PhysicalLocationPanel } from "@/components/employee-profile/panels/PhysicalLocationPanel";
import { ReportingManagerPanel } from "@/components/employee-profile/panels/ReportingManagerPanel";
import { ContractPanel } from "@/components/employee-profile/panels/ContractPanel";
import { WorkTypePanel } from "@/components/employee-profile/panels/WorkTypePanel";
import { OrgStructurePanel } from "@/components/employee-profile/panels/OrgStructurePanel";
import { WorkingConditionPanel } from "@/components/employee-profile/panels/WorkingConditionPanel";
import { ApplicantPanel } from "@/components/employee-profile/panels/ApplicantPanel";
import { RecruitmentTimelinePanel } from "@/components/employee-profile/panels/RecruitmentTimelinePanel";
import { OfferDetailsPanel } from "@/components/employee-profile/panels/OfferDetailsPanel";
import { OnboardingChecklistPanel } from "@/components/employee-profile/panels/OnboardingChecklistPanel";
import { ProbationPanel } from "@/components/employee-profile/panels/ProbationPanel";
import { SpecialRequirementsPanel } from "@/components/employee-profile/panels/SpecialRequirementsPanel";
import { PerformanceSummaryPanel } from "@/components/employee-profile/panels/PerformanceSummaryPanel";
import { PerformanceGoalsPanel } from "@/components/employee-profile/panels/PerformanceGoalsPanel";
import { PerformanceHistoryPanel } from "@/components/employee-profile/panels/PerformanceHistoryPanel";
import { FeedbackPanel } from "@/components/employee-profile/panels/FeedbackPanel";
import { EducationPanel } from "@/components/employee-profile/panels/EducationPanel";
import { WorkExperiencePanel } from "@/components/employee-profile/panels/WorkExperiencePanel";
import { SkillsPanel } from "@/components/employee-profile/panels/SkillsPanel";
import { CompetencyPanel } from "@/components/employee-profile/panels/CompetencyPanel";
import { ThreeSixtyFeedbackPanel } from "@/components/employee-profile/panels/ThreeSixtyFeedbackPanel";
import { TalentProfilePanel } from "@/components/employee-profile/panels/TalentProfilePanel";
import { SuccessionPanel } from "@/components/employee-profile/panels/SuccessionPanel";
import { CareerPathPanel } from "@/components/employee-profile/panels/CareerPathPanel";
import { PromotionHistoryPanel } from "@/components/employee-profile/panels/PromotionHistoryPanel";
import { InternalMobilityPanel } from "@/components/employee-profile/panels/InternalMobilityPanel";
import { TrainingHistoryPanel } from "@/components/employee-profile/panels/TrainingHistoryPanel";
import { LDCertificationsPanel } from "@/components/employee-profile/panels/LDCertificationsPanel";
import { ConsolidatedIDPPanel } from "@/components/employee-profile/panels/ConsolidatedIDPPanel";
import { CurrentYearIDPPanel } from "@/components/employee-profile/panels/CurrentYearIDPPanel";
import { MentoringPanel } from "@/components/employee-profile/panels/MentoringPanel";
import { SkillsGapAnalysisPanel } from "@/components/employee-profile/panels/SkillsGapAnalysisPanel";

const mainSections = [
  { id: "personal", label: "Personal Profile", icon: User, color: "bg-primary" },
  { id: "identity", label: "Identity & Compliance", icon: Shield, color: "bg-category-talent" },
  { id: "job", label: "Job & Organization", icon: Building2, color: "bg-category-planning" },
  { id: "ta", label: "TA & Onboarding", icon: Target, color: "bg-category-strategy" },
  { id: "performance", label: "Performance", icon: BarChart3, color: "bg-status-completed" },
  { id: "talent", label: "Talent Management", icon: Star, color: "bg-priority-medium" },
  { id: "learning", label: "Learning & Development", icon: GraduationCap, color: "bg-category-analytics" },
];

const personalSubSections = [
  { id: "basic", label: "Basic Information" },
  { id: "physical", label: "Physical & Health" },
  { id: "family", label: "Family Details" },
  { id: "contact", label: "Contact & Social" },
  { id: "languages", label: "Languages & Hobbies" },
  { id: "appreciations", label: "Appreciations" },
  { id: "patents", label: "Patents & IP" },
];

const identitySubSections = [
  { id: "government-ids", label: "Government IDs" },
  { id: "employer-ids", label: "Employer IDs & Access" },
  { id: "bank-accounts", label: "Bank Account Details" },
  { id: "dependents", label: "Dependents Details" },
  { id: "nominations", label: "Nominations" },
  { id: "statutory", label: "Statutory Registration" },
  { id: "nda", label: "NDA & Agreements" },
  { id: "policies", label: "Policy Acknowledgments" },
  { id: "training", label: "Mandatory Training" },
  { id: "background", label: "Background Verification" },
  { id: "legal-status", label: "Legal Status" },
];

const jobSubSections = [
  { id: "job-title", label: "Job Title & Designation" },
  { id: "job-grade", label: "Job Grade & JE Score" },
  { id: "physical-location", label: "Physical Location" },
  { id: "reporting-manager", label: "Reporting Manager" },
  { id: "contract", label: "Contract & Employment" },
  { id: "work-type", label: "Work Type & Classification" },
  { id: "org-structure", label: "Org Structure & Cost Centre" },
  { id: "working-condition", label: "Working Conditions" },
];

const taSubSections = [
  { id: "applicant", label: "Applicant ID & Position" },
  { id: "recruitment", label: "Recruitment Timeline" },
  { id: "offer", label: "Offer Details" },
  { id: "onboarding", label: "Onboarding Checklist" },
  { id: "probation", label: "Probation & Confirmation" },
  { id: "special-req", label: "Special Requirements" },
];

const performanceSubSections = [
  { id: "perf-summary", label: "Performance Summary" },
  { id: "perf-goals", label: "Goals & Objectives" },
  { id: "perf-history", label: "Ratings History (5-Year)" },
  { id: "perf-feedback", label: "Feedback & Check-ins" },
];

const talentSubSections = [
  { id: "education", label: "Education & Qualifications" },
  { id: "work-experience", label: "Work Experience" },
  { id: "skills", label: "Skills & Capabilities" },
  { id: "competency", label: "Competency Assessment" },
  { id: "360-feedback", label: "360° Feedback Summary" },
  { id: "talent-profile", label: "Talent Profile & 9-Box" },
  { id: "succession", label: "Succession Planning" },
  { id: "career-path", label: "Career Path & Aspirations" },
  { id: "promotions", label: "Promotion History" },
  { id: "internal-mobility", label: "Internal Mobility" },
];

const learningSubSections = [
  { id: "training-history", label: "Training History" },
  { id: "ld-certifications", label: "Certifications" },
  { id: "consolidated-idp", label: "Consolidated IDP" },
  { id: "current-idp", label: "IDP (Current Year)" },
  { id: "mentoring", label: "Mentoring Programs" },
  { id: "skills-gap", label: "Skills Gap Analysis" },
];

const EmployeeProfile = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const [activeSubSection, setActiveSubSection] = useState("basic");

  const getCurrentSubSections = () => {
    switch (activeSection) {
      case "personal": return personalSubSections;
      case "identity": return identitySubSections;
      case "job": return jobSubSections;
      case "ta": return taSubSections;
      case "performance": return performanceSubSections;
      case "talent": return talentSubSections;
      case "learning": return learningSubSections;
      default: return personalSubSections;
    }
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    // Reset to first sub-section when changing main section
    if (sectionId === "personal") {
      setActiveSubSection("basic");
    } else if (sectionId === "identity") {
      setActiveSubSection("government-ids");
    } else if (sectionId === "job") {
      setActiveSubSection("job-title");
    } else if (sectionId === "ta") {
      setActiveSubSection("applicant");
    } else if (sectionId === "performance") {
      setActiveSubSection("perf-summary");
    } else if (sectionId === "talent") {
      setActiveSubSection("education");
    } else if (sectionId === "learning") {
      setActiveSubSection("training-history");
    }
  };

  const renderSubSectionContent = () => {
    // Personal Profile sections
    if (activeSection === "personal") {
      switch (activeSubSection) {
        case "basic": return <BasicInfoPanel />;
        case "physical": return <PhysicalHealthPanel />;
        case "family": return <FamilyPanel />;
        case "contact": return <ContactPanel />;
        case "languages": return <LanguagesPanel />;
        case "appreciations": return <AppreciationsPanel />;
        case "patents": return <PatentsPanel />;
        default: return <BasicInfoPanel />;
      }
    }
    
    // Identity & Compliance sections
    if (activeSection === "identity") {
      switch (activeSubSection) {
        case "government-ids": return <GovernmentIDsPanel />;
        case "employer-ids": return <EmployerIDsPanel />;
        case "bank-accounts": return <BankAccountPanel />;
        case "dependents": return <DependentsPanel />;
        case "nominations": return <NominationsPanel />;
        case "statutory": return <StatutoryPanel />;
        case "nda": return <NDAPanel />;
        case "policies": return <PolicyAcknowledgmentsPanel />;
        case "training": return <MandatoryTrainingPanel />;
        case "background": return <BackgroundVerificationPanel />;
        case "legal-status": return <LegalStatusPanel />;
        default: return <GovernmentIDsPanel />;
      }
    }

    // Job & Organization sections
    if (activeSection === "job") {
      switch (activeSubSection) {
        case "job-title": return <JobTitlePanel />;
        case "job-grade": return <JobGradePanel />;
        case "physical-location": return <PhysicalLocationPanel />;
        case "reporting-manager": return <ReportingManagerPanel />;
        case "contract": return <ContractPanel />;
        case "work-type": return <WorkTypePanel />;
        case "org-structure": return <OrgStructurePanel />;
        case "working-condition": return <WorkingConditionPanel />;
        default: return <JobTitlePanel />;
      }
    }

    // TA & Onboarding sections
    if (activeSection === "ta") {
      switch (activeSubSection) {
        case "applicant": return <ApplicantPanel />;
        case "recruitment": return <RecruitmentTimelinePanel />;
        case "offer": return <OfferDetailsPanel />;
        case "onboarding": return <OnboardingChecklistPanel />;
        case "probation": return <ProbationPanel />;
        case "special-req": return <SpecialRequirementsPanel />;
        default: return <ApplicantPanel />;
      }
    }

    // Performance sections
    if (activeSection === "performance") {
      switch (activeSubSection) {
        case "perf-summary": return <PerformanceSummaryPanel />;
        case "perf-goals": return <PerformanceGoalsPanel />;
        case "perf-history": return <PerformanceHistoryPanel />;
        case "perf-feedback": return <FeedbackPanel />;
        default: return <PerformanceSummaryPanel />;
      }
    }

    if (activeSection === "talent") {
      switch (activeSubSection) {
        case "education": return <EducationPanel />;
        case "work-experience": return <WorkExperiencePanel />;
        case "skills": return <SkillsPanel />;
        case "competency": return <CompetencyPanel />;
        case "360-feedback": return <ThreeSixtyFeedbackPanel />;
        case "talent-profile": return <TalentProfilePanel />;
        case "succession": return <SuccessionPanel />;
        case "career-path": return <CareerPathPanel />;
        case "promotions": return <PromotionHistoryPanel />;
        case "internal-mobility": return <InternalMobilityPanel />;
        default: return <EducationPanel />;
      }
    }

    if (activeSection === "learning") {
      switch (activeSubSection) {
        case "training-history": return <TrainingHistoryPanel />;
        case "ld-certifications": return <LDCertificationsPanel />;
        case "consolidated-idp": return <ConsolidatedIDPPanel />;
        case "current-idp": return <CurrentYearIDPPanel />;
        case "mentoring": return <MentoringPanel />;
        case "skills-gap": return <SkillsGapAnalysisPanel />;
        default: return <TrainingHistoryPanel />;
      }
    }

    return <BasicInfoPanel />;
  };

  const getSectionLabel = () => {
    const section = mainSections.find(s => s.id === activeSection);
    return section?.label || "Personal Profile";
  };

  return (
    <div className="flex min-h-screen bg-background">
      <LeftSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto">
          {/* Compact Hero Banner */}
          <div className="group/hero relative bg-gradient-to-r from-primary/5 via-card to-card border-b border-border">
            <div className="max-w-[1800px] mx-auto px-6 py-5">
              <div className="flex items-center gap-6">
                {/* Avatar with status ring */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative"
                >
                  <div className="p-[3px] rounded-full bg-gradient-to-br from-primary via-primary/50 to-primary">
                    <Avatar className="h-20 w-20 border-2 border-card">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" />
                      <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">JM</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 p-1.5 bg-card rounded-full">
                    <div className="w-5 h-5 bg-status-completed rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </motion.div>

                {/* Info */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex-1"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-xl font-bold text-foreground">John David Mitchell</h1>
                    <Badge className="bg-status-active/10 text-status-active border-0 text-[10px]">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Senior Data Scientist • Data Science & AI Division</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> New York, USA</span>
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> john.mitchell@company.com</span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> +1 (212) 555-0147</span>
                  </div>
                </motion.div>

                {/* Quick Stats Pills */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="hidden lg:flex items-center gap-3 mt-8"
                >
                {[
                    { label: "Years", value: "8.5", icon: Calendar },
                    { label: "Rating", value: "4.8", icon: Star },
                    { label: "Awards", value: "12", icon: Award },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-xl">
                      <stat.icon className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-bold text-foreground leading-none">{stat.value}</p>
                        <p className="text-[9px] text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Action icons - right-aligned, appear on hover, aligned with employee name */}
              <div className="absolute top-5 right-6 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-200">
                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground" title="Edit Profile">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive" title="Delete Profile">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground" title="Print Profile" onClick={() => window.print()}>
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground" title="Audit Trail">
                        <History className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[50vw] max-w-[50vw] overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                          <History className="h-5 w-5 text-primary" />
                          Audit Trail
                        </SheetTitle>
                      </SheetHeader>
                      <div className="mt-4">
                        <AuditTrailPanel />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </div>

          {/* Main Section Navigation - Horizontal Pills */}
          <div className="border-b border-border bg-card/50">
            <div className="max-w-[1800px] mx-auto px-6">
              <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
                {mainSections.map((section, index) => {
                  const isActive = activeSection === section.id;
                  return (
                    <motion.button
                      key={section.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSectionChange(section.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                        ${isActive 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }
                      `}
                    >
                      <section.icon className="h-4 w-4" />
                      {section.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area with Sidebar Navigation */}
          <div className="max-w-[1800px] mx-auto">
            <div className="flex">
              {/* Left: Vertical Sub-section Nav */}
              <ProfileSectionNav 
                sections={getCurrentSubSections()}
                activeSection={activeSubSection}
                onSectionChange={setActiveSubSection}
                sectionLabel={getSectionLabel()}
              />

              {/* Right: Content Panel */}
              <div className="flex-1 p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSubSection}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    {renderSubSectionContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>

        <footer className="px-6 py-3 border-t border-border">
          <p className="text-[10px] text-muted-foreground text-center">© 2025 BlueNxt Consulting</p>
        </footer>
      </div>
    </div>
  );
};

export default EmployeeProfile;
