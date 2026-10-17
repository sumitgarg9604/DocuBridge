import React, { useState } from 'react';
import { PRESET_APPLICANTS } from './data/presetApplicants';
import { ApplicantCase, DocRecord, DocType, AuditEvent } from './types/docubridge';
import { UserSession } from './types/auth';
import { Header } from './components/Header';
import { ImpactStatsStrip } from './components/ImpactStatsStrip';
import { CustomerPortal } from './components/CustomerPortal';
import { StaffConsole } from './components/StaffConsole';
import { RequestInfoModal } from './components/RequestInfoModal';
import { UploadCustomDocModal } from './components/UploadCustomDocModal';
import { LoginPage } from './components/LoginPage';
import { CreateCustomerModal } from './components/CreateCustomerModal';

export default function App() {
  const [cases, setCases] = useState<ApplicantCase[]>(PRESET_APPLICANTS);
  const [currentCaseId, setCurrentCaseId] = useState<string>('APP-2026-IN-8491'); // Priya Sharma default
  const [session, setSession] = useState<UserSession | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isRequestInfoOpen, setIsRequestInfoOpen] = useState<boolean>(false);
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState<boolean>(false);
  const [requestInfoDocType, setRequestInfoDocType] = useState<string>('Form 16 or Latest ITR');

  const currentCase = cases.find((c) => c.id === currentCaseId) || cases[0];

  const handleLogin = (newSession: UserSession, targetApplicantId?: string) => {
    setSession(newSession);
    if (targetApplicantId) {
      setCurrentCaseId(targetApplicantId);
    }
  };

  const handleSignOut = () => {
    setSession(null);
  };

  const handleToggleRole = () => {
    if (!session) return;
    if (session.role === 'customer') {
      setSession({
        role: 'staff',
        name: 'Amit Kumar',
        email: 'amit.kumar@bankops.internal',
        roleTitle: 'Senior Credit Underwriter',
        employeeId: 'EMP-BFSI-4821',
        department: 'Retail Lending & Risk Management',
      });
    } else {
      setSession({
        role: 'customer',
        name: currentCase.applicantName,
        email: currentCase.email,
        roleTitle: 'Loan Applicant',
        applicantId: currentCase.id,
      });
    }
  };

  const handleSelectCase = (c: ApplicantCase) => {
    setCurrentCaseId(c.id);
  };

  const handleUpdateCase = (updated: ApplicantCase) => {
    setCases((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleOpenRequestInfo = (docType: string) => {
    setRequestInfoDocType(docType);
    setIsRequestInfoOpen(true);
  };

  const handleCustomerCreated = (newCase: ApplicantCase, autoLoginAsApplicant?: boolean) => {
    setCases((prev) => [newCase, ...prev]);
    setCurrentCaseId(newCase.id);

    if (autoLoginAsApplicant) {
      setSession({
        role: 'customer',
        name: newCase.applicantName,
        email: newCase.email,
        roleTitle: 'Loan Applicant',
        applicantId: newCase.id,
      });
    }
  };

  const handleDocumentProcessed = (doc: DocRecord) => {
    const updatedCase = { ...currentCase };
    updatedCase.documents = {
      ...updatedCase.documents,
      [doc.docType]: doc,
    };

    // Append to audit trail
    const auditEv: AuditEvent = {
      id: `AUD-UP-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: 'Document Intake Agent',
      actorRole: 'agent',
      action: `Uploaded ${doc.title}`,
      details: `Processed ${doc.fileName} (${doc.language}). Quality: ${doc.quality}. Extracted ${doc.fields.length} fields.`,
      severity: doc.quality === 'ok' ? 'info' : 'warning',
    };
    updatedCase.auditTrail = [auditEv, ...updatedCase.auditTrail];

    // Recalculate status
    const allDocs = Object.values(updatedCase.documents).filter(Boolean);
    const hasHighFlag = allDocs.some((d) => d?.flags.some((f) => f.severity === 'High'));
    if (hasHighFlag) {
      updatedCase.status = 'Needs review';
      updatedCase.riskLevel = 'High';
    } else {
      const requiredTypes: DocType[] = ['aadhaar_card', 'pan_card', 'salary_slip', 'bank_statement', 'proof_of_address'];
      const allVerified = requiredTypes.every((t) => updatedCase.documents[t]?.quality === 'ok');
      if (allVerified) {
        updatedCase.status = 'Complete';
        updatedCase.riskLevel = 'Low';
      }
    }

    handleUpdateCase(updatedCase);
  };

  // If not logged in, show enterprise Login Page
  if (!session) {
    return (
      <>
        <LoginPage
          onLogin={handleLogin}
          cases={cases}
          onOpenCreateCustomer={() => setIsCreateCustomerOpen(true)}
        />
        <CreateCustomerModal
          isOpen={isCreateCustomerOpen}
          onClose={() => setIsCreateCustomerOpen(false)}
          onCustomerCreated={handleCustomerCreated}
          isTriggeredFromLogin={true}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        session={session}
        onSignOut={handleSignOut}
        cases={cases}
        currentCase={currentCase}
        onSelectCase={handleSelectCase}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onToggleRole={handleToggleRole}
        onOpenCreateCustomer={() => setIsCreateCustomerOpen(true)}
      />

      <ImpactStatsStrip />

      {/* Main Viewport Content based on authenticated role */}
      <main className="flex-1 overflow-auto">
        {session.role === 'customer' ? (
          <CustomerPortal
            currentCase={currentCase}
            onUpdateCase={handleUpdateCase}
            onSwitchToStaffConsole={handleToggleRole}
          />
        ) : (
          <StaffConsole
            cases={cases}
            currentCase={currentCase}
            onSelectCase={handleSelectCase}
            onUpdateCase={handleUpdateCase}
            onRequestInfoModal={handleOpenRequestInfo}
            onOpenCreateCustomer={() => setIsCreateCustomerOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <CreateCustomerModal
        isOpen={isCreateCustomerOpen}
        onClose={() => setIsCreateCustomerOpen(false)}
        onCustomerCreated={handleCustomerCreated}
        isTriggeredFromLogin={false}
      />

      <RequestInfoModal
        isOpen={isRequestInfoOpen}
        onClose={() => setIsRequestInfoOpen(false)}
        applicant={currentCase}
        defaultDocType={requestInfoDocType}
      />

      <UploadCustomDocModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDocumentProcessed={handleDocumentProcessed}
      />
    </div>
  );
}
