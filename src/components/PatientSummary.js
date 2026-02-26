import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Chip, IconButton, Tooltip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import { mockMedications, mockAllergies, mockProblems, mockLabs, mockCareTeam } from '../utils/mockData';

const PatientSummary = ({ patientId }) => {
  const [expanded, setExpanded] = React.useState('medications');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const ProvenanceIcon = ({ item }) => (
    <Tooltip
      title={
        <Box>
          <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
            Provenance Information
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            Source: {item.source}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            Source MRN: {item.sourceMRN}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            Last Updated: {new Date(item.lastUpdated).toLocaleString()}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            Ingested: {new Date(item.ingestedAt).toLocaleString()}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            Version: {item.versionId}
          </Typography>
          {item.provenance && (
            <Typography variant="caption" sx={{ display: 'block' }}>
              Author: {item.provenance.author}
            </Typography>
          )}
        </Box>
      }
      arrow
    >
      <IconButton size="small" aria-label="View provenance information">
        <InfoIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Patient Summary
      </Typography>

      <Accordion expanded={expanded === 'medications'} onChange={handleChange('medications')}>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="medications-content"
          id="medications-header"
        >
          <Typography sx={{ fontWeight: 600 }}>Medications ({mockMedications.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Medication</TableCell>
                  <TableCell>Dosage</TableCell>
                  <TableCell>Prescriber</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell align="right">Info</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockMedications.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell>{med.name}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>{med.prescriber}</TableCell>
                    <TableCell>
                      <Chip label={med.status} size="small" color="success" />
                    </TableCell>
                    <TableCell>
                      <Chip label={med.source} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{new Date(med.lastUpdated).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <ProvenanceIcon item={med} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'allergies'} onChange={handleChange('allergies')}>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="allergies-content"
          id="allergies-header"
        >
          <Typography sx={{ fontWeight: 600 }}>Allergies ({mockAllergies.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Allergen</TableCell>
                  <TableCell>Reaction</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell align="right">Info</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockAllergies.map((allergy) => (
                  <TableRow key={allergy.id}>
                    <TableCell>{allergy.allergen}</TableCell>
                    <TableCell>{allergy.reaction}</TableCell>
                    <TableCell>
                      <Chip 
                        label={allergy.severity} 
                        size="small" 
                        color={allergy.severity === 'Severe' ? 'error' : 'warning'} 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={allergy.source} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{new Date(allergy.lastUpdated).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <ProvenanceIcon item={allergy} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'problems'} onChange={handleChange('problems')}>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="problems-content"
          id="problems-header"
        >
          <Typography sx={{ fontWeight: 600 }}>Problems ({mockProblems.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Condition</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Onset Date</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell align="right">Info</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockProblems.map((problem) => (
                  <TableRow key={problem.id}>
                    <TableCell>{problem.condition}</TableCell>
                    <TableCell>
                      <Chip label={problem.status} size="small" color="info" />
                    </TableCell>
                    <TableCell>{new Date(problem.onsetDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label={problem.source} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{new Date(problem.lastUpdated).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <ProvenanceIcon item={problem} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'labs'} onChange={handleChange('labs')}>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="labs-content"
          id="labs-header"
        >
          <Typography sx={{ fontWeight: 600 }}>Recent Labs ({mockLabs.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Test</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Range</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell align="right">Info</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockLabs.map((lab) => (
                  <TableRow key={lab.id}>
                    <TableCell>{lab.test}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{lab.value}</TableCell>
                    <TableCell>{lab.range}</TableCell>
                    <TableCell>{new Date(lab.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label={lab.source} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <ProvenanceIcon item={lab} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'careteam'} onChange={handleChange('careteam')}>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="careteam-content"
          id="careteam-header"
        >
          <Typography sx={{ fontWeight: 600 }}>Care Team ({mockCareTeam.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Specialty</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Source</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockCareTeam.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.specialty}</TableCell>
                    <TableCell>{member.contact}</TableCell>
                    <TableCell>
                      <Chip label={member.source} size="small" variant="outlined" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default PatientSummary;