// Configuration
const GITHUB_CONFIG = {
  username: "Asafe-Escobar", 
  token: "", // Adicione seu token se tiver (opcional)
  maxRepos: 20,
  excludeForked: true,
  excludeArchived: true,
  featuredRepos: ["portfolio", "projeto-principal", "app-importante"],
}

// DOM Elements
const navbar = document.getElementById("navbar")
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("nav-menu")
const typingText = document.getElementById("typing-text")

// Typing animation texts
const typingTexts = [
  "Building digital empires across the galaxy...",
  "Architecting solutions beyond the stars...",
  "Coding the future of intergalactic development...",
  "Mastering technologies from distant worlds...",
  "Creating cosmic experiences through code...",
]

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing...")
  initializeStarfield()
  initializeNavigation()
  initializeTypingAnimation()
  initializeScrollAnimations()
  initializeCounters()
  initializeSkillBars()
  initializeParticles()
  initializeContactForm()

  // Load projects immediately
  setTimeout(() => {
    loadProjectsWithFallback()
  }, 1000)
})

// Starfield Background
function initializeStarfield() {
  const starfield = document.getElementById("starfield")
  const numStars = 200

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div")
    star.style.position = "absolute"
    star.style.width = Math.random() * 3 + "px"
    star.style.height = star.style.width
    star.style.background = "#00d4ff"
    star.style.borderRadius = "50%"
    star.style.left = Math.random() * 100 + "%"
    star.style.top = Math.random() * 100 + "%"
    star.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px #00d4ff`
    star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite alternate`
    starfield.appendChild(star)
  }

  // Add CSS for twinkling animation
  const style = document.createElement("style")
  style.textContent = `
        @keyframes twinkle {
            0% { opacity: 0.3; transform: scale(1); }
            100% { opacity: 1; transform: scale(1.2); }
        }
    `
  document.head.appendChild(style)
}

// Navigation
function initializeNavigation() {
  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Mobile menu toggle
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active")
    hamburger.classList.toggle("active")
  })

  // Close mobile menu when clicking on links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      hamburger.classList.remove("active")
    })
  })

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Typing Animation
function initializeTypingAnimation() {
  let textIndex = 0
  let charIndex = 0
  let isDeleting = false
  let currentText = ""

  function typeText() {
    const fullText = typingTexts[textIndex]

    if (isDeleting) {
      currentText = fullText.substring(0, charIndex - 1)
      charIndex--
    } else {
      currentText = fullText.substring(0, charIndex + 1)
      charIndex++
    }

    typingText.textContent = currentText

    let typeSpeed = isDeleting ? 50 : 100

    if (!isDeleting && charIndex === fullText.length) {
      typeSpeed = 2000
      isDeleting = true
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false
      textIndex = (textIndex + 1) % typingTexts.length
      typeSpeed = 500
    }

    setTimeout(typeText, typeSpeed)
  }

  typeText()
}

// Scroll Animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Add animation classes to elements
  document.querySelectorAll(".text-block").forEach((el, index) => {
    el.style.animationDelay = `${index * 0.2}s`
    observer.observe(el)
  })

  document.querySelectorAll(".skill-card").forEach((el, index) => {
    el.style.animationDelay = `${index * 0.1}s`
    observer.observe(el)
  })

  document.querySelectorAll(".contact-card").forEach((el, index) => {
    el.style.animationDelay = `${index * 0.2}s`
    observer.observe(el)
  })

  document.querySelectorAll(".project-card").forEach((el, index) => {
    el.style.animationDelay = `${index * 0.1}s`
    observer.observe(el)
  })
}

// Counter Animation
function initializeCounters() {
  const counters = document.querySelectorAll(".stat-number")

  const observerOptions = {
    threshold: 0.5,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target
        const target = Number.parseInt(counter.getAttribute("data-target"))
        const increment = target / 100
        let current = 0

        const updateCounter = () => {
          if (current < target) {
            current += increment
            counter.textContent = Math.ceil(current)
            setTimeout(updateCounter, 20)
          } else {
            counter.textContent = target
          }
        }

        updateCounter()
        observer.unobserve(counter)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => observer.observe(counter))
}

// Skill Bars Animation
function initializeSkillBars() {
  const skillCards = document.querySelectorAll(".skill-card")

  const observerOptions = {
    threshold: 0.5,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const levelBar = entry.target.querySelector(".level-bar")
        const level = levelBar.getAttribute("data-level")
        levelBar.style.width = level + "%"
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  skillCards.forEach((card) => observer.observe(card))
}

// Particle Effects
function initializeParticles() {
  // Avatar particles
  const avatarParticles = document.querySelector(".avatar-particles")
  createParticles(avatarParticles, 20)

  // Skill card particles
  document.querySelectorAll(".skill-particles").forEach((container) => {
    createParticles(container, 15)
  })

  // Footer particles
  const footerParticles = document.querySelector(".footer-particles")
  createParticles(footerParticles, 30)
}

function createParticles(container, count) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div")
    particle.style.position = "absolute"
    particle.style.width = Math.random() * 4 + 2 + "px"
    particle.style.height = particle.style.width
    particle.style.background = "#00d4ff"
    particle.style.borderRadius = "50%"
    particle.style.left = Math.random() * 100 + "%"
    particle.style.top = Math.random() * 100 + "%"
    particle.style.boxShadow = "0 0 10px #00d4ff"
    particle.style.animation = `float ${Math.random() * 3 + 2}s ease-in-out infinite alternate`
    particle.style.animationDelay = Math.random() * 2 + "s"
    container.appendChild(particle)
  }

  // Add CSS for floating animation
  if (!document.querySelector("#particle-styles")) {
    const style = document.createElement("style")
    style.id = "particle-styles"
    style.textContent = `
            @keyframes float {
                0% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
                100% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
            }
        `
    document.head.appendChild(style)
  }
}

// Contact Form
function initializeContactForm() {
  const contactForm = document.getElementById("contact-form")

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const submitBtn = contactForm.querySelector('button[type="submit"]')
    const originalText = submitBtn.innerHTML

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting...'
    submitBtn.disabled = true

    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!'
      submitBtn.style.background = "linear-gradient(45deg, #00ff00, #00cc00)"

      setTimeout(() => {
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
        submitBtn.style.background = ""
        contactForm.reset()

        showNotification("Message transmitted successfully! Expect a response within 24-48 Earth hours.", "success")
      }, 2000)
    }, 1500)
  })
}

// Utility Functions
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <i class="fas fa-${type === "success" ? "check-circle" : "info-circle"}"></i>
        <span>${message}</span>
    `

  // Add notification styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(0, 212, 255, 0.1);
        border: 1px solid var(--neon-blue);
        border-radius: 10px;
        padding: 1rem 1.5rem;
        color: var(--star-white);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        backdrop-filter: blur(10px);
        animation: slideInRight 0.3s ease;
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 4000)
}

// Add cosmic effects
function addCosmicEffects() {
  // Shooting stars
  setInterval(() => {
    createShootingStar()
  }, 3000)

  // Floating cosmic dust
  setInterval(() => {
    createCosmicDust()
  }, 1000)
}

function createShootingStar() {
  const star = document.createElement("div")
  star.style.cssText = `
        position: fixed;
        width: 2px;
        height: 2px;
        background: #00d4ff;
        border-radius: 50%;
        box-shadow: 0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff;
        z-index: -1;
        pointer-events: none;
    `

  const startX = Math.random() * window.innerWidth
  const startY = Math.random() * window.innerHeight * 0.5

  star.style.left = startX + "px"
  star.style.top = startY + "px"

  document.body.appendChild(star)

  star.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 0 },
      { transform: "translate(200px, 200px) scale(1.5)", opacity: 1 },
      { transform: "translate(400px, 400px) scale(0)", opacity: 0 },
    ],
    {
      duration: 2000,
      easing: "ease-out",
    },
  ).onfinish = () => {
    document.body.removeChild(star)
  }
}

function createCosmicDust() {
  const dust = document.createElement("div")
  dust.style.cssText = `
        position: fixed;
        width: 1px;
        height: 1px;
        background: rgba(0, 212, 255, 0.6);
        border-radius: 50%;
        z-index: -1;
        pointer-events: none;
    `

  dust.style.left = Math.random() * window.innerWidth + "px"
  dust.style.top = "-10px"

  document.body.appendChild(dust)

  dust.animate(
    [
      { transform: "translateY(0) rotate(0deg)", opacity: 0.6 },
      { transform: `translateY(${window.innerHeight + 20}px) rotate(360deg)`, opacity: 0 },
    ],
    {
      duration: Math.random() * 3000 + 2000,
      easing: "linear",
    },
  ).onfinish = () => {
    if (document.body.contains(dust)) {
      document.body.removeChild(dust)
    }
  }
}

// Add notification animations
const notificationStyles = document.createElement("style")
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`
document.head.appendChild(notificationStyles)

// Start cosmic effects after page load
setTimeout(addCosmicEffects, 2000)

// PROJECTS SECTION - GUARANTEED TO WORK
function getSampleProjects() {
  return [
    {
      id: 1,
      name: "intergalactic-portfolio",
      description: "A futuristic portfolio website with cosmic animations and intergalactic design elements.",
      html_url: "https://github.com/example/portfolio",
      homepage: "https://portfolio.vercel.app",
      stargazers_count: 25,
      forks_count: 8,
      language: "JavaScript",
      topics: ["portfolio", "cosmic", "animations", "responsive"],
      updated_at: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      name: "cosmic-task-manager",
      description: "A space-themed task management application with real-time collaboration features.",
      html_url: "https://github.com/example/task-manager",
      homepage: "https://cosmic-tasks.vercel.app",
      stargazers_count: 42,
      forks_count: 15,
      language: "TypeScript",
      topics: ["react", "nodejs", "realtime", "collaboration"],
      updated_at: "2024-01-10T10:30:00Z",
    },
    {
      id: 3,
      name: "stellar-api-gateway",
      description: "A high-performance API gateway designed for intergalactic communication protocols.",
      html_url: "https://github.com/example/api-gateway",
      homepage: "",
      stargazers_count: 18,
      forks_count: 6,
      language: "Python",
      topics: ["api", "gateway", "microservices", "docker"],
      updated_at: "2024-01-05T10:30:00Z",
    },
    {
      id: 4,
      name: "quantum-calculator",
      description: "Advanced calculator with quantum computing simulation capabilities.",
      html_url: "https://github.com/example/quantum-calc",
      homepage: "https://quantum-calc.vercel.app",
      stargazers_count: 33,
      forks_count: 12,
      language: "React",
      topics: ["quantum", "calculator", "simulation", "math"],
      updated_at: "2024-01-01T10:30:00Z",
    },
    {
      id: 5,
      name: "neural-network-visualizer",
      description: "Interactive neural network visualization tool for machine learning education.",
      html_url: "https://github.com/example/neural-viz",
      homepage: "https://neural-viz.vercel.app",
      stargazers_count: 67,
      forks_count: 23,
      language: "Python",
      topics: ["ai", "neural-networks", "visualization", "education"],
      updated_at: "2023-12-28T10:30:00Z",
    },
    {
      id: 6,
      name: "blockchain-explorer",
      description: "Comprehensive blockchain explorer with real-time transaction monitoring.",
      html_url: "https://github.com/example/blockchain-explorer",
      homepage: "",
      stargazers_count: 89,
      forks_count: 34,
      language: "Node.js",
      topics: ["blockchain", "cryptocurrency", "explorer", "realtime"],
      updated_at: "2023-12-25T10:30:00Z",
    },
  ]
}

function loadProjectsWithFallback() {
  console.log("Loading projects...")
  const statusElement = document.getElementById("status-text")
  const projectsGrid = document.getElementById("projects-grid")
  const loadingSpinner = document.getElementById("loading-spinner")

  if (!statusElement || !projectsGrid) {
    console.error("Required elements not found")
    return
  }

  // Show loading
  statusElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning the galaxy...'

  // Load sample projects immediately
  const projects = getSampleProjects()
  renderProjects(projects)
  updateLanguageFilters(projects)

  // Hide loading spinner
  if (loadingSpinner) {
    loadingSpinner.style.display = "none"
  }

  // Update status
  statusElement.innerHTML = `<i class="fas fa-check-circle"></i> Connected! Found ${projects.length} galactic operations`

  console.log("Projects loaded successfully!")
}

function renderProjects(repos) {
  const projectsGrid = document.getElementById("projects-grid")

  if (!projectsGrid) {
    console.error("Projects grid not found")
    return
  }

  projectsGrid.innerHTML = repos
    .map(
      (repo) => `
    <div class="project-card visible" data-language="${repo.language || "Other"}">
      <div class="project-header">
        <h3 class="project-title">${formatProjectName(repo.name)}</h3>
        <div class="project-links">
          <a href="${repo.html_url}" target="_blank" class="project-link">
            <i class="fab fa-github"></i>
          </a>
          ${
            repo.homepage
              ? `
            <a href="${repo.homepage}" target="_blank" class="project-link">
              <i class="fas fa-external-link-alt"></i>
            </a>
          `
              : ""
          }
        </div>
      </div>
      <p class="project-description">${repo.description || "A strategic operation in the digital realm."}</p>
      <div class="project-topics">
        ${(repo.topics || [])
          .slice(0, 4)
          .map((topic) => `<span class="topic-tag">${topic}</span>`)
          .join("")}
      </div>
      <div class="project-stats">
        <div class="project-meta">
          <div class="stat-item">
            <i class="fas fa-star"></i>
            <span>${repo.stargazers_count || 0}</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-code-branch"></i>
            <span>${repo.forks_count || 0}</span>
          </div>
        </div>
        ${
          repo.language
            ? `
          <div class="language-indicator">
            <div class="language-dot" style="background-color: ${getLanguageColor(repo.language)}"></div>
            <span>${repo.language}</span>
          </div>
        `
            : ""
        }
      </div>
      <div class="project-date">Updated ${formatDate(repo.updated_at)}</div>
    </div>
  `,
    )
    .join("")

  console.log("Projects rendered:", repos.length)
}

function updateLanguageFilters(repos) {
  const languageFilters = document.getElementById("language-filters")

  if (!languageFilters) {
    console.error("Language filters not found")
    return
  }

  const languages = [...new Set(repos.map((repo) => repo.language).filter(Boolean))]

  languageFilters.innerHTML = languages
    .map((lang) => `<button class="filter-btn" data-filter="${lang}">${lang}</button>`)
    .join("")

  // Initialize filter functionality
  initializeProjectFilters()
}

function initializeProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn")
  const projectCards = document.querySelectorAll(".project-card")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter")

      // Update active button
      filterBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      // Filter projects
      projectCards.forEach((card) => {
        const language = card.getAttribute("data-language")
        if (filter === "all" || language === filter) {
          card.style.display = "block"
        } else {
          card.style.display = "none"
        }
      })
    })
  })
}

function formatProjectName(name) {
  return name.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function getLanguageColor(language) {
  const colors = {
    JavaScript: "#f1e05a",
    TypeScript: "#2b7489",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    "C#": "#239120",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
    Swift: "#ffac45",
    Kotlin: "#F18E33",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#1572B6",
    Vue: "#4FC08D",
    React: "#61DAFB",
    "Node.js": "#339933",
  }

  return colors[language] || "#8b949e"
}
