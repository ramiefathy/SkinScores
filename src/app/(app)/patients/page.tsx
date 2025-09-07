"use client";

import React, { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  UserPlus, 
  Link,
  Copy,
  Calendar,
  TrendingUp,
  Search,
  QrCode,
  AlertCircle
} from 'lucide-react';
import { PatientTimelineView } from '@/components/patient/PatientTimelineView';
import {
  getPatientRecords,
  createPatientRecord,
  savePatientRecord,
  generatePatientLink,
  savePatientLink,
  findPatientRecordByPatientId,
  encryptPatientId,
  type PatientRecord
} from '@/lib/patient-progress';
import { toolMetadata } from '@/lib/tools';
import type { ToolMetadata } from '@/lib/tools/tool-metadata';
import { format } from 'date-fns';
import QRCode from 'qrcode';

export default function PatientsPage() {
  const { toast } = useToast();
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [showNewPatientDialog, setShowNewPatientDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [newPatientId, setNewPatientId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [linkExpiration, setLinkExpiration] = useState('48');

  // Load patients on mount
  useEffect(() => {
    const records = getPatientRecords();
    setPatients(records);
  }, []);

  const handleCreatePatient = () => {
    if (!newPatientId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a patient identifier",
        variant: "destructive"
      });
      return;
    }

    const encryptedId = encryptPatientId(newPatientId);
    const existing = findPatientRecordByPatientId(encryptedId);
    
    if (existing) {
      toast({
        title: "Patient Exists",
        description: "This patient already has a record",
        variant: "destructive"
      });
      return;
    }

    const newRecord = createPatientRecord(newPatientId);
    savePatientRecord(newRecord);
    setPatients([...patients, newRecord]);
    setSelectedPatient(newRecord);
    setShowNewPatientDialog(false);
    setNewPatientId('');
    
    toast({
      title: "Patient Created",
      description: "New patient record has been created",
    });
  };

  const handleGenerateLink = async () => {
    if (!selectedPatient || selectedTools.length === 0) return;

    const link = generatePatientLink(
      selectedPatient.id,
      selectedTools,
      parseInt(linkExpiration)
    );
    
    savePatientLink(link);
    
    // Generate URL
    const baseUrl = window.location.origin;
    const linkUrl = `${baseUrl}/patient-assessment/${link.id}`;
    setGeneratedLink(linkUrl);
    
    // Generate QR code
    try {
      const qrDataUrl = await QRCode.toDataURL(linkUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        }
      });
      setQrCodeUrl(qrDataUrl);
    } catch (err) {
      console.error('QR code generation failed:', err);
    }
    
    setShowLinkDialog(true);
    
    toast({
      title: "Link Generated",
      description: "Patient assessment link has been created",
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "Copied",
      description: "Link copied to clipboard",
    });
  };

  const filteredPatients = patients.filter(patient => 
    patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Patient-reported tools that can be self-assessed
  const patientFriendlyTools = toolMetadata.filter(tool =>
    tool.name.toLowerCase().includes('dlqi') ||
    tool.name.toLowerCase().includes('poem') ||
    tool.name.toLowerCase().includes('qol') ||
    tool.description?.toLowerCase().includes('patient reported') ||
    tool.description?.toLowerCase().includes('quality of life') ||
    tool.description?.toLowerCase().includes('self-assessed')
  );

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Patient Progress Tracking</h1>
            <p className="text-muted-foreground">
              Track patient scores over time and enable self-assessments
            </p>
          </div>
          <Button onClick={() => setShowNewPatientDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            New Patient
          </Button>
        </div>

        <Tabs defaultValue="patients" className="space-y-4">
          <TabsList>
            <TabsTrigger value="patients">All Patients</TabsTrigger>
            <TabsTrigger value="active" disabled={!selectedPatient}>
              {selectedPatient ? 'Patient Timeline' : 'Select a Patient'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {filteredPatients.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Patients Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'No patients match your search' : 'Start by creating a new patient record'}
                  </p>
                  <Button onClick={() => setShowNewPatientDialog(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create First Patient
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPatients.map(patient => (
                  <Card 
                    key={patient.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            Patient {patient.id.slice(0, 8)}
                          </CardTitle>
                          <CardDescription>
                            Created {format(new Date(patient.createdAt), 'MMM dd, yyyy')}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">
                          {patient.timeline.length} assessments
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Last updated
                        </span>
                        <span className="font-medium">
                          {format(new Date(patient.lastUpdated), 'MMM dd')}
                        </span>
                      </div>
                      {patient.timeline.length > 1 && (
                        <div className="mt-2 flex items-center gap-1 text-sm">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-muted-foreground">
                            View progress timeline
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active">
            {selectedPatient && (
              <PatientTimelineView
                patientRecord={selectedPatient}
                onGenerateLink={() => {
                  setSelectedTools([]);
                  setShowLinkDialog(true);
                }}
                onAddEntry={() => {
                  toast({
                    title: "Add Assessment",
                    description: "Select a tool from the sidebar to add an assessment",
                  });
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* New Patient Dialog */}
      <Dialog open={showNewPatientDialog} onOpenChange={setShowNewPatientDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Patient Record</DialogTitle>
            <DialogDescription>
              Enter a unique identifier for the patient. This will be encrypted and used to track their progress.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="patient-id">Patient Identifier</Label>
              <Input
                id="patient-id"
                placeholder="e.g., MRN, initials + DOB"
                value={newPatientId}
                onChange={(e) => setNewPatientId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreatePatient()}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This identifier will be encrypted for privacy
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewPatientDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePatient}>
              Create Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate Patient Assessment Link</DialogTitle>
            <DialogDescription>
              Create a secure link for patients to complete self-assessments
            </DialogDescription>
          </DialogHeader>
          
          {!generatedLink ? (
            <div className="space-y-4">
              <div>
                <Label>Select Tools for Self-Assessment</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-64 overflow-y-auto">
                  {patientFriendlyTools.map(tool => (
                    <div key={tool.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={tool.id}
                        checked={selectedTools.includes(tool.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTools([...selectedTools, tool.id]);
                          } else {
                            setSelectedTools(selectedTools.filter(id => id !== tool.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={tool.id} className="text-sm cursor-pointer">
                        {tool.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="expiration">Link Expiration</Label>
                <Select value={linkExpiration} onValueChange={setLinkExpiration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="48">48 hours</SelectItem>
                    <SelectItem value="72">72 hours</SelectItem>
                    <SelectItem value="168">1 week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label>Patient Assessment Link</Label>
                  <Button size="sm" variant="ghost" onClick={copyLink}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <Input value={generatedLink} readOnly className="font-mono text-sm" />
              </div>
              
              {qrCodeUrl && (
                <div className="text-center">
                  <Label className="mb-2 block">QR Code (for in-office use)</Label>
                  <img src={qrCodeUrl} alt="QR Code" className="mx-auto" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Patient can scan this code to access the assessment
                  </p>
                </div>
              )}
              
              <div className="rounded-lg bg-yellow-50 p-4 text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Link Details</p>
                    <ul className="mt-1 space-y-1 text-yellow-800">
                      <li>• Expires in {linkExpiration} hours</li>
                      <li>• Can be used up to 5 times</li>
                      <li>• Results will be added to patient timeline</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowLinkDialog(false);
              setGeneratedLink('');
              setQrCodeUrl('');
            }}>
              Close
            </Button>
            {!generatedLink && (
              <Button 
                onClick={handleGenerateLink}
                disabled={selectedTools.length === 0}
              >
                Generate Link
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}