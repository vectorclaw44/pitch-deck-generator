import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

function getAuth(): OAuth2Client {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    throw new Error('Missing Google OAuth credentials in environment variables');
  }

  const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  return oauth2Client;
}

export async function createPresentation(title: string): Promise<string> {
  const auth = getAuth();
  const slides = google.slides({ version: 'v1', auth });
  
  const response = await slides.presentations.create({
    requestBody: { title },
  });
  
  return response.data.presentationId!;
}

export async function addSlide(
  presentationId: string,
  layout: string = 'BLANK'
): Promise<string> {
  const auth = getAuth();
  const slides = google.slides({ version: 'v1', auth });
  const slideId = `slide_${Date.now()}`;

  await slides.presentations.batchUpdate({
    presentationId,
    requestBody: {
      requests: [{
        createSlide: {
          objectId: slideId,
          slideLayoutReference: {
            predefinedLayout: layout as any,
          },
        },
      }],
    },
  });

  return slideId;
}

export async function addTextBox(
  presentationId: string,
  slideId: string,
  text: string,
  position: { x: number; y: number; width: number; height: number },
  fontSize: number = 24,
  bold: boolean = false
): Promise<string> {
  const auth = getAuth();
  const slides = google.slides({ version: 'v1', auth });
  const textBoxId = `text_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  await slides.presentations.batchUpdate({
    presentationId,
    requestBody: {
      requests: [
        {
          createShape: {
            objectId: textBoxId,
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageObjectId: slideId,
              size: {
                width: { magnitude: position.width, unit: 'PT' },
                height: { magnitude: position.height, unit: 'PT' },
              },
              transform: {
                scaleX: 1,
                scaleY: 1,
                translateX: position.x,
                translateY: position.y,
                unit: 'PT',
              },
            },
          },
        },
        {
          insertText: {
            objectId: textBoxId,
            text,
            insertionIndex: 0,
          },
        },
        {
          updateTextStyle: {
            objectId: textBoxId,
            style: {
              fontSize: { magnitude: fontSize, unit: 'PT' },
              bold,
            },
            textRange: { type: 'ALL' },
            fields: 'fontSize,bold',
          },
        },
      ],
    },
  });

  return textBoxId;
}

export async function makePublic(presentationId: string): Promise<void> {
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });

  await drive.permissions.create({
    fileId: presentationId,
    requestBody: {
      type: 'anyone',
      role: 'reader',
    },
  });
}

export interface PitchDeckData {
  companyName: string;
  tagline: string;
  problem: string;
  solution: string;
  market: string;
  businessModel: string;
  traction: string;
  team: string;
  askAmount: string;
}

export async function generatePitchDeck(data: PitchDeckData): Promise<{
  presentationId: string;
  editUrl: string;
  viewUrl: string;
}> {
  // Create presentation
  const presentationId = await createPresentation(`${data.companyName} - Pitch Deck`);

  // Slide 1: Title
  const slide1 = await addSlide(presentationId, 'BLANK');
  await addTextBox(presentationId, slide1, data.companyName, { x: 50, y: 150, width: 620, height: 80 }, 48, true);
  await addTextBox(presentationId, slide1, data.tagline, { x: 50, y: 250, width: 620, height: 50 }, 24, false);

  // Slide 2: Problem
  const slide2 = await addSlide(presentationId, 'BLANK');
  await addTextBox(presentationId, slide2, 'The Problem', { x: 50, y: 30, width: 620, height: 50 }, 36, true);
  await addTextBox(presentationId, slide2, data.problem, { x: 50, y: 100, width: 620, height: 300 }, 18, false);

  // Slide 3: Solution
  const slide3 = await addSlide(presentationId, 'BLANK');
  await addTextBox(presentationId, slide3, 'Our Solution', { x: 50, y: 30, width: 620, height: 50 }, 36, true);
  await addTextBox(presentationId, slide3, data.solution, { x: 50, y: 100, width: 620, height: 300 }, 18, false);

  // Slide 4: Market
  const slide4 = await addSlide(presentationId, 'BLANK');
  await addTextBox(presentationId, slide4, 'Market Opportunity', { x: 50, y: 30, width: 620, height: 50 }, 36, true);
  await addTextBox(presentationId, slide4, data.market, { x: 50, y: 100, width: 620, height: 300 }, 18, false);

  // Slide 5: Business Model
  const slide5 = await addSlide(presentationId, 'BLANK');
  await addTextBox(presentationId, slide5, 'Business Model', { x: 50, y: 30, width: 620, height: 50 }, 36, true);
  await addTextBox(presentationId, slide5, data.businessModel, { x: 50, y: 100, width: 620, height: 300 }, 18, false);

  // Slide 6: Traction
  const slide6 = await addSlide(presentationId, 'BLANK');
  await addTextBox(presentationId, slide6, 'Traction', { x: 50, y: 30, width: 620, height: 50 }, 36, true);
  await addTextBox(presentationId, slide6, data.traction, { x: 50, y: 100, width: 620, height: 300 }, 18, false);

  // Slide 7: Team
  const slide7 = await addSlide(presentationId, 'BLANK');
  await addTextBox(presentationId, slide7, 'The Team', { x: 50, y: 30, width: 620, height: 50 }, 36, true);
  await addTextBox(presentationId, slide7, data.team, { x: 50, y: 100, width: 620, height: 300 }, 18, false);

  // Slide 8: Ask
  const slide8 = await addSlide(presentationId, 'BLANK');
  await addTextBox(presentationId, slide8, 'The Ask', { x: 50, y: 30, width: 620, height: 50 }, 36, true);
  await addTextBox(presentationId, slide8, data.askAmount, { x: 50, y: 150, width: 620, height: 80 }, 32, true);

  // Make public for viewing
  await makePublic(presentationId);

  return {
    presentationId,
    editUrl: `https://docs.google.com/presentation/d/${presentationId}/edit`,
    viewUrl: `https://docs.google.com/presentation/d/${presentationId}/embed`,
  };
}
