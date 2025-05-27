// GitHub Portfolio Integration - Configured for Asafe-Escobar
// Configuration
const GITHUB_CONFIG = {
  username: "Asafe-Escobar",
  token: "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", // Seu token do GitHub
  maxRepos: 20,
  excludeForked: true,
  excludeArchived: true,
  featuredRepos: ["portfolio", "projeto-principal", "app-importante"], // Seus repositórios em destaque
}

// DOM Elements
const navbar = document.getElementById("navbar")
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("nav-menu")
const typingText = document.getElementById("typing-text")

// Typing animation texts
const typingTexts = [
  "Desenvolvendo soluções escaláveis e inovadoras...",
  "Criando arquiteturas robustas e eficientes...",
  "Aplicando as melhores práticas de engenharia...",
  "Transformando ideias em código de qualidade...",
  "Construindo o futuro através da tecnologia...",
]

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Iniciando portfólio conectado ao GitHub...")

  // Initialize AOS if available
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    })
  }

  initializeLightSpeedEffects()
  initializeNavigation()
  if (typingText) initializeTypingAnimation()
  initializeScrollAnimations()
  initializeCounters()
  initializeSkillBars()
  initializeContactForm()
  initializeProjectFilters()
  
  // Load GitHub projects
  if (document.getElementById("projects-grid")) {
    loadGitHubProjectsConnected()
  }
})

// Enhanced GitHub API integration with your credentials
async function fetchGitHubRepositories() {
  const { username, token, maxRepos } = GITHUB_CONFIG

  try {
    console.log(`🔍 Conectando ao GitHub de ${username}...`)
    
    const headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Portfolio-Asafe-Escobar",
      "Authorization": `token ${token}` // Usando seu token
    }

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=${maxRepos}&type=owner`,
      { 
        headers,
        cache: 'no-cache'
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Usuário '${username}' não encontrado`)
      } else if (response.status === 401) {
        throw new Error("Token inválido ou expirado")
      } else if (response.status === 403) {
        throw new Error("Acesso negado - verifique as permissões do token")
      } else {
        throw new Error(`Erro da API: ${response.status} - ${response.statusText}`)
      }
    }

    const repos = await response.json()
    console.log(`✅ ${repos.length} repositórios encontrados para ${username}`)
    
    return filterAndSortRepos(repos)
  } catch (error) {
    console.error("❌ Erro ao conectar com GitHub:", error)
    throw error
  }
}

function filterAndSortRepos(repos) {
  const { excludeForked, excludeArchived, featuredRepos } = GITHUB_CONFIG

  // Filter repositories
  const filteredRepos = repos.filter((repo) => {
    if (excludeForked && repo.fork) return false
    if (excludeArchived && repo.archived) return false
    if (!repo.name) return false
    return true
  })

  // Sort repositories (featured first, then by stars, then by update date)
  filteredRepos.sort((a, b) => {
    const aFeatured = featuredRepos.includes(a.name)
    const bFeatured = featuredRepos.includes(b.name)

    if (aFeatured && !bFeatured) return -1
    if (!aFeatured && bFeatured) return 1

    // If both featured or both not, sort by stars then update date
    if (a.stargazers_count !== b.stargazers_count) {
      return b.stargazers_count - a.stargazers_count
    }

    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  })

  return filteredRepos
}

// Connected project loading
async function loadGitHubProjectsConnected() {
  const statusElement = document.getElementById("status-text")
  const projectsGrid = document.getElementById("projects-grid")
  const loadingSpinner = document.getElementById("loading-spinner")

  if (!statusElement || !projectsGrid) {
    console.error("❌ Elementos necessários não encontrados")
    return
  }

  try {
    // Show loading state
    statusElement.innerHTML = '<i class="fab fa-github fa-spin"></i> Conectando ao GitHub de Asafe-Escobar...'
    if (loadingSpinner) loadingSpinner.style.display = "block"

    // Fetch repositories from GitHub
    const repos = await fetchGitHubRepositories()
    
    if (repos.length === 0) {
      statusElement.innerHTML = '<i class="fas fa-info-circle"></i> Nenhum repositório público encontrado'
      if (loadingSpinner) loadingSpinner.style.display = "none"
      return
    }

    // Render real projects from GitHub
    renderGitHubProjects(repos)
    updateLanguageFilters(repos)

    // Update status - success
    statusElement.innerHTML = `<i class="fas fa-check-circle"></i> ✅ Conectado! ${repos.length} projetos carregados do GitHub`
    
    // Hide loading spinner
    if (loadingSpinner) {
      loadingSpinner.style.display = "none"
    }

    console.log("✅ Projetos do GitHub carregados com sucesso!")

  } catch (error) {
    console.warn("⚠️ Erro ao conectar com GitHub:", error.message)
    
    // Show error and fallback
    statusElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Erro: ${error.message}`
    
    // Load sample projects as fallback after 3 seconds
    setTimeout(() => {
      const sampleProjects = getSampleProjectsBR()
      renderGitHubProjects(sampleProjects)
      updateLanguageFilters(sampleProjects)
      statusElement.innerHTML = `<i class="fas fa-info-circle"></i> Exibindo projetos de exemplo`
    }, 3000)
    
    // Hide loading spinner
    if (loadingSpinner) {
      loadingSpinner.style.display = "none"
    }
  }
}

// Render projects with enhanced GitHub data
function renderGitHubProjects(repos) {
  const projectsGrid = document.getElementById("projects-grid")

  if (!projectsGrid) {
    console.error("❌ Grid de projetos não encontrado")
    return
  }

  projectsGrid.innerHTML = repos
    .map((repo, index) => {
      const updatedDate = repo.updated_at ? formatDateBR(repo.updated_at) : "Data não disponível"
      const description = repo.description || "Projeto desenvolvido aplicando boas práticas de engenharia de software."
      const topics = repo.topics || []
      const isFeatured = GITHUB_CONFIG.featuredRepos.includes(repo.name)
      
      return `
        <div class="project-card ${isFeatured ? 'featured' : ''}" 
             data-language="${repo.language || "Other"}" 
             data-aos="fade-up" 
             data-aos-delay="${Math.min(index * 100, 800)}">
            ${isFeatured ? '<div class="featured-badge"><i class="fas fa-star"></i> Destaque</div>' : ''}
            <div class="project-header">
                <h3 class="project-title">${formatProjectName(repo.name)}</h3>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" class="project-link" title="Ver código no GitHub">
                        <i class="fab fa-github"></i>
                    </a>
                    ${repo.homepage ? `
                        <a href="${repo.homepage}" target="_blank" class="project-link" title="Ver demonstração">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    ` : ""}
                </div>
            </div>
            <p class="project-description">${description}</p>
            ${topics.length > 0 ? `
                <div class="project-topics">
                    ${topics.slice(0, 4).map(topic => `<span class="topic-tag">${topic}</span>`).join("")}
                </div>
            ` : ""}
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
                    ${repo.size ? `
                        <div class="stat-item">
                            <i class="fas fa-hdd"></i>
                            <span>${formatSize(repo.size)}</span>
                        </div>
                    ` : ""}
                </div>
                ${repo.language ? `
                    <div class="language-indicator">
                        <div class="language-dot" style="background-color: ${getLanguageColor(repo.language)}"></div>
                        <span>${repo.language}</span>
                    </div>
                ` : ""}
            </div>
            <div class="project-date">Atualizado em ${updatedDate}</div>
        </div>
      `
    })
    .join("")

  // Refresh AOS animations for new elements
  if (window.AOS) {
    setTimeout(() => {
      AOS.refresh()
    }, 100)
  }

  console.log(`✅ ${repos.length} projetos renderizados`)
}

// Utility functions
function formatProjectName(name) {
  return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

function formatDateBR(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatSize(sizeInKB) {
  if (sizeInKB < 1024) return `${sizeInKB}KB`
  const sizeInMB = (sizeInKB / 1024).toFixed(1)
  return `${sizeInMB}MB`
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
    Solidity: "#363636",
    Shell: "#89e051",
    "Jupyter Notebook": "#DA5B0B",
    Dockerfile: "#384d54",
  }

  return colors[language] || "#8b949e"
}

function updateLanguageFilters(repos) {
  const languageFilters = document.getElementById("language-filters")

  if (!languageFilters) return

  const languages = [...new Set(repos.map((repo) => repo.language).filter(Boolean))]
    .sort()

  languageFilters.innerHTML = languages
    .map((lang) => `<button class="filter-btn" data-filter="${lang}">${lang}</button>`)
    .join("")

  initializeProjectFilters()
}

// Sample projects as fallback
function getSampleProjectsBR() {
  return [
    {
      id: 1,
      name: "sistema-gestao-empresarial",
      description: "Sistema completo de gestão empresarial desenvolvido com React e Node.js, incluindo módulos de vendas, estoque e relatórios financeiros.",
      html_url: "https://github.com/Asafe-Escobar/sistema-gestao",
      homepage: "https://gestao-demo.vercel.app",
      stargazers_count: 45,
      forks_count: 12,
      language: "JavaScript",
      topics: ["react", "nodejs", "postgresql", "business", "dashboard"],
      updated_at: "2024-01-15T10:30:00Z",
      size: 2048,
    },
    {
      id: 2,
      name: "api-microservicos-ecommerce",
      description: "Arquitetura de microsserviços para e-commerce com Docker, implementando padrões de design e práticas de DevOps.",
      html_url: "https://github.com/Asafe-Escobar/ecommerce-api",
      homepage: "",
      stargazers_count: 67,
      forks_count: 23,
      language: "TypeScript",
      topics: ["microservices", "docker", "api", "ecommerce", "kubernetes"],
      updated_at: "2024-01-10T10:30:00Z",
      size: 3072,
    },
    {
      id: 3,
      name: "dashboard-analytics-python",
      description: "Dashboard de analytics em tempo real usando Python, FastAPI e visualizações interativas com dados de múltiplas fontes.",
      html_url: "https://github.com/Asafe-Escobar/analytics-dashboard",
      homepage: "https://analytics-demo.herokuapp.com",
      stargazers_count: 34,
      forks_count: 8,
      language: "Python",
      topics: ["analytics", "fastapi", "dashboard", "data-visualization", "realtime"],
      updated_at: "2024-01-05T10:30:00Z",
      size: 1536,
    }
  ]
}

// Keep all existing functions from the original script
function initializeLightSpeedEffects() {
  createLightStreaks()
  createFloatingParticles()
  setInterval(createLightStreaks, 3000)
  setInterval(createFloatingParticles, 2000)
}

function createLightStreaks() {
  const lightSpeedBg = document.getElementById("light-speed-bg")
  if (!lightSpeedBg) return

  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const streak = document.createElement("div")
      streak.className = "light-streak"
      streak.style.top = Math.random() * 100 + "%"
      streak.style.left = "-100px"
      streak.style.animationDelay = Math.random() * 0.5 + "s"
      lightSpeedBg.appendChild(streak)

      setTimeout(() => {
        if (lightSpeedBg.contains(streak)) {
          lightSpeedBg.removeChild(streak)
        }
      }, 1000)
    }, i * 200)
  }
}

function createFloatingParticles() {
  const lightSpeedBg = document.getElementById("light-speed-bg")
  if (!lightSpeedBg) return

  for (let i = 0; i < 5; i++) {
    const particle = document.createElement("div")
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 2}px;
      height: ${Math.random() * 4 + 2}px;
      background: #00d4ff;
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      box-shadow: 0 0 ${Math.random() * 20 + 10}px #00d4ff;
      animation: floatParticle ${Math.random() * 4 + 3}s ease-in-out infinite;
      pointer-events: none;
    `
    lightSpeedBg.appendChild(particle)

    setTimeout(() => {
      if (lightSpeedBg.contains(particle)) {
        lightSpeedBg.removeChild(particle)
      }
    }, Math.random() * 4000 + 3000)
  }

  if (!document.querySelector("#floating-particles-styles")) {
    const style = document.createElement("style")
    style.id = "floating-particles-styles"
    style.textContent = `
      @keyframes floatParticle {
        0% { 
          transform: translateY(0px) translateX(0px) scale(1);
          opacity: 0.8;
        }
        50% { 
          transform: translateY(-30px) translateX(20px) scale(1.2);
          opacity: 1;
        }
        100% { 
          transform: translateY(-60px) translateX(-10px) scale(0.8);
          opacity: 0.3;
        }
      }
    `
    document.head.appendChild(style)
  }
}

function initializeNavigation() {
  window.addEventListener("scroll", () => {
    if (navbar && window.scrollY > 100) {
      navbar.classList.add("scrolled")
    } else if (navbar) {
      navbar.classList.remove("scrolled")
    }
  })

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      hamburger.classList.toggle("active")
    })

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (navMenu) navMenu.classList.remove("active")
        if (hamburger) hamburger.classList.remove("active")
      })
    })
  }

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

function initializeSkillBars() {
  const skillCards = document.querySelectorAll(".skill-card")

  const observerOptions = {
    threshold: 0.5,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const levelBar = entry.target.querySelector(".level-bar")
        if (levelBar) {
          const level = levelBar.getAttribute("data-level")
          if (level) {
            levelBar.style.width = level + "%"
          }
        }
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  skillCards.forEach((card) => observer.observe(card))
}

function initializeProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn")
  const projectCards = document.querySelectorAll(".project-card")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter")

      filterBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

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

function initializeContactForm() {
  const contactForm = document.getElementById("contact-form")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const submitBtn = contactForm.querySelector('button[type="submit"]')
      const originalText = submitBtn.innerHTML

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...'
      submitBtn.disabled = true

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!'
        submitBtn.style.background = "linear-gradient(45deg, #00ff00, #00cc00)"

        setTimeout(() => {
          submitBtn.innerHTML = originalText
          submitBtn.disabled = false
          submitBtn.style.background = ""
          contactForm.reset()

          showNotification("Mensagem enviada com sucesso! Retorno em breve.", "success")
        }, 2000)
      }, 1500)
    })
  }
}

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
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 4000)
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

  .project-card.featured {
    border: 2px solid var(--neon-blue);
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
    position: relative;
  }

  .featured-badge {
    position: absolute;
    top: -1px;
    right: -1px;
    background: linear-gradient(45deg, var(--neon-blue), var(--electric-blue));
    color: var(--deep-space);
    padding: 0.3rem 0.8rem;
    border-radius: 0 8px 0 8px;
    font-size: 0.7rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
`
document.head.appendChild(notificationStyles)