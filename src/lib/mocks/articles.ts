import { ExternalApiResponse } from "@/lib/schemas";

// Mock data simulating external API responses
export const mockArticles: ExternalApiResponse[] = [
  {
    id: "article-001",
    title: "The Future of Artificial Intelligence in Healthcare",
    content: `Artificial Intelligence is revolutionizing healthcare in unprecedented ways. From diagnostic imaging to drug discovery, AI technologies are enabling healthcare professionals to provide more accurate diagnoses and personalized treatments.

Machine learning algorithms can analyze medical images with superhuman accuracy, detecting early signs of diseases that might be missed by human eyes. In radiology, AI systems can identify tumors, fractures, and other abnormalities in X-rays, MRIs, and CT scans with remarkable precision.

The pharmaceutical industry is also benefiting from AI-driven drug discovery. Traditional drug development can take 10-15 years and cost billions of dollars. AI is accelerating this process by predicting molecular behavior, identifying potential drug candidates, and optimizing clinical trial designs.

Personalized medicine is another area where AI is making significant impact. By analyzing a patient's genetic profile, lifestyle, and medical history, AI can recommend tailored treatment plans that are more effective and have fewer side effects.

However, the integration of AI in healthcare also presents challenges. Data privacy, algorithmic bias, and the need for regulatory frameworks are critical considerations that must be addressed to ensure AI benefits all patients equitably.

As we move forward, the collaboration between healthcare professionals and AI systems will be crucial in creating a more efficient, accurate, and accessible healthcare system for everyone.`,
    author: "Dr. Sarah Johnson",
    publishedAt: "2024-01-15T10:30:00Z",
    tags: ["AI", "Healthcare", "Technology", "Medicine", "Innovation"],
    metadata: {
      wordCount: 245,
      readingTime: "3 minutes",
      category: "Technology",
      featured: true,
    },
  },
  {
    id: "article-002",
    title: "Sustainable Energy Solutions for Modern Cities",
    content: `As urban populations continue to grow, cities worldwide are facing unprecedented challenges in energy consumption and environmental sustainability. The need for innovative energy solutions has never been more critical.

Solar energy technology has advanced significantly, with modern photovoltaic cells achieving efficiency rates above 20%. Cities are increasingly adopting solar panel installations on rooftops, parking structures, and even roads. These installations not only generate clean energy but also reduce urban heat island effects.

Wind energy is another crucial component of sustainable urban energy systems. Vertical axis wind turbines are being integrated into building designs, taking advantage of the wind patterns created by urban architecture. These systems can generate significant amounts of electricity while maintaining aesthetic appeal.

Smart grid technology is revolutionizing how cities manage energy distribution. Advanced sensors and AI algorithms optimize energy flow, reduce waste, and ensure reliable power supply. These systems can automatically balance supply and demand, integrate renewable sources, and provide real-time monitoring.

Energy storage solutions, particularly advanced battery systems, are becoming more efficient and cost-effective. Large-scale battery installations can store excess renewable energy during peak production and release it during high demand periods.

The integration of electric vehicles into urban transportation systems is also contributing to energy sustainability. Smart charging infrastructure, vehicle-to-grid technology, and autonomous electric fleets are transforming how cities approach transportation and energy management.

These innovations are not just technological achievements; they represent a fundamental shift toward more sustainable, resilient, and livable urban environments.`,
    author: "Michael Chen",
    publishedAt: "2024-01-20T14:45:00Z",
    tags: [
      "Sustainability",
      "Energy",
      "Urban Planning",
      "Technology",
      "Environment",
    ],
    metadata: {
      wordCount: 198,
      readingTime: "2 minutes",
      category: "Environment",
      featured: false,
    },
  },
  {
    id: "article-003",
    title:
      "The Evolution of Remote Work: Lessons from the Digital Transformation",
    content: `The global shift to remote work has fundamentally changed how organizations operate and how employees approach their professional lives. This transformation has brought both opportunities and challenges that continue to shape the future of work.

Productivity studies have shown mixed results, with some organizations reporting increased efficiency while others struggle with collaboration and team cohesion. The key to successful remote work lies in proper infrastructure, clear communication protocols, and strong leadership.

Technology has been the enabler of this transformation. Video conferencing platforms, project management tools, and cloud-based collaboration software have become essential business tools. However, the human element remains crucial for maintaining team culture and employee engagement.

Mental health and work-life balance have emerged as critical considerations in remote work environments. Organizations are implementing wellness programs, flexible schedules, and virtual team-building activities to support their remote workforce.

The future of work is likely to be hybrid, combining the benefits of remote flexibility with the value of in-person collaboration. Companies are redesigning office spaces to support this new model, creating flexible environments that accommodate both remote and on-site work.

As we continue to navigate this new landscape, the lessons learned from the remote work experiment will inform how we design work environments, develop leadership practices, and build organizational cultures for the digital age.`,
    author: "Lisa Rodriguez",
    publishedAt: "2024-01-25T09:15:00Z",
    tags: [
      "Remote Work",
      "Digital Transformation",
      "Productivity",
      "Leadership",
      "Technology",
    ],
    metadata: {
      wordCount: 156,
      readingTime: "2 minutes",
      category: "Business",
      featured: true,
    },
  },
];
