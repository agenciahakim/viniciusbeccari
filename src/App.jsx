import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const phone = '5541984639897'
const directMessage = encodeURIComponent('Olá, Vinicius! Conheci seu site e gostaria de conversar sobre consórcio.')
const directWhatsApp = `https://wa.me/${phone}?text=${directMessage}`

const modalities = [
  {
    number: '01',
    title: 'Imóveis',
    description: 'Da compra da casa à construção ou reforma: explore uma carta de crédito para o seu projeto imobiliário.',
    question: 'Imóvel',
  },
  {
    number: '02',
    title: 'Veículos',
    description: 'Carro, moto ou veículo para o trabalho: planeje a próxima aquisição com mais clareza sobre as opções.',
    question: 'Veículo',
  },
  {
    number: '03',
    title: 'Serviços',
    description: 'Viagens, estudos e outros projetos pessoais também podem começar com planejamento.',
    question: 'Serviço',
  },
]

const questions = [
  {
    label: 'O que você quer conquistar?',
    short: 'Objetivo',
    options: ['Imóvel', 'Veículo', 'Serviço', 'Ainda estou explorando'],
  },
  {
    label: 'Qual faixa de crédito você imagina?',
    short: 'Crédito desejado',
    options: ['Até R$ 100 mil', 'De R$ 100 mil a R$ 250 mil', 'De R$ 250 mil a R$ 500 mil', 'Acima de R$ 500 mil', 'Ainda não sei'],
  },
  {
    label: 'Qual parcela mensal cabe no seu planejamento?',
    short: 'Parcela confortável',
    options: ['Até R$ 500', 'De R$ 500 a R$ 1 mil', 'De R$ 1 mil a R$ 2 mil', 'Acima de R$ 2 mil', 'Prefiro definir em conversa'],
  },
  {
    label: 'Quando você pretende começar?',
    short: 'Momento',
    options: ['Quero começar agora', 'Nos próximos 3 meses', 'Mais adiante', 'Ainda estou avaliando'],
  },
]

const faqs = [
  {
    question: 'Consórcio tem juros?',
    answer: 'O consórcio não cobra juros como um financiamento. Há taxa de administração e podem existir outros custos previstos no contrato, como fundo de reserva e seguro. As condições exatas dependem do plano escolhido.',
  },
  {
    question: 'Quando posso usar a carta de crédito?',
    answer: 'A utilização acontece após a contemplação, que pode ocorrer por sorteio ou lance, conforme as regras do grupo e a análise exigida para liberação do crédito. Não há uma data garantida para contemplação.',
  },
  {
    question: 'Preciso saber o valor exato antes de conversar?',
    answer: 'Não. Uma ideia do objetivo e do valor mensal confortável já ajuda a começar. O quiz desta página organiza essas informações para a primeira conversa; ele não calcula uma proposta ou parcela definitiva.',
  },
  {
    question: 'Posso ser atendido fora de Florianópolis?',
    answer: 'Sim. Vinicius atende principalmente Florianópolis e região e também conversa com pessoas de outras partes do Brasil.',
  },
]

function Arrow({ diagonal = false }) {
  return <span className="arrow" aria-hidden="true">{diagonal ? '↗' : '→'}</span>
}

function WhatsAppLink({ children, className = '', messageUrl = directWhatsApp }) {
  return (
    <a className={className} href={messageUrl} target="_blank" rel="noopener noreferrer">
      {children}<Arrow diagonal />
    </a>
  )
}

function Quiz({ registerOpen }) {
  const [answers, setAnswers] = useState(Array(questions.length).fill(''))
  const [step, setStep] = useState(0)
  const [showSummary, setShowSummary] = useState(false)
  const questionRef = useRef(null)

  useEffect(() => {
    registerOpen(() => (category) => {
      if (category) {
        setAnswers((previous) => [category, ...previous.slice(1)])
        setStep(1)
      } else {
        setStep(0)
      }
      setShowSummary(false)
      document.getElementById('quiz')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
    })
  }, [registerOpen])

  useEffect(() => {
    if (!showSummary) questionRef.current?.focus({ preventScroll: true })
  }, [step, showSummary])

  const select = (value) => setAnswers((previous) => previous.map((answer, index) => index === step ? value : answer))
  const next = () => {
    if (!answers[step]) return
    if (step === questions.length - 1) setShowSummary(true)
    else setStep((current) => current + 1)
  }
  const back = () => {
    if (showSummary) setShowSummary(false)
    else setStep((current) => Math.max(0, current - 1))
  }
  const message = encodeURIComponent(`Olá, Vinicius! Respondi às perguntas no seu site e gostaria de conversar sobre consórcio.\n\n${questions.map((question, index) => `${question.short}: ${answers[index]}`).join('\n')}\n\nPodemos conversar sobre as opções?`)
  const resultUrl = `https://wa.me/${phone}?text=${message}`

  return (
    <section className="quiz-section section-pad" id="quiz" aria-labelledby="quiz-title">
      <div className="section-topline" data-reveal><span>03 / PONTO DE PARTIDA</span><span>LEVA CERCA DE 1 MINUTO</span></div>
      <div className="quiz-layout">
        <div className="quiz-intro" data-reveal>
          <h2 id="quiz-title">Qual é o seu <em>próximo plano?</em></h2>
          <p>Em quatro perguntas, você organiza o que busca e já chega à conversa com o Vinicius com um ponto de partida. Revise antes de enviar.</p>
          <span className="quiz-asterisk" aria-hidden="true">✳</span>
        </div>
        <div className="quiz-panel" data-reveal>
          {!showSummary ? (
            <>
              <div className="quiz-progress"><span>PERGUNTA {String(step + 1).padStart(2, '0')} / 04</span><span>{questions[step].short.toUpperCase()}</span></div>
              <div className="progress-track" aria-hidden="true"><span style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
              <h3 ref={questionRef} tabIndex={-1}>{questions[step].label}</h3>
              <div className="quiz-options" role="group" aria-label={questions[step].label}>
                {questions[step].options.map((option) => (
                  <button key={option} type="button" className={`quiz-option ${answers[step] === option ? 'selected' : ''}`} aria-pressed={answers[step] === option} onClick={() => select(option)}>
                    <span className="option-indicator" aria-hidden="true" />{option}<Arrow diagonal />
                  </button>
                ))}
              </div>
              <div className="quiz-actions">
                {step > 0 ? <button type="button" className="text-button" onClick={back}>Voltar</button> : <span />}
                <button type="button" className="button button-dark" onClick={next} disabled={!answers[step]}>{step === questions.length - 1 ? 'Revisar respostas' : 'Próxima pergunta'}<Arrow /></button>
              </div>
            </>
          ) : (
            <div className="quiz-result">
              <div className="quiz-progress"><span>SEU RESUMO</span><span>PRONTO PARA CONVERSAR</span></div>
              <h3>Seu plano já tem um começo.</h3>
              <dl>{questions.map((question, index) => <div key={question.short}><dt>{question.short}</dt><dd>{answers[index]}</dd></div>)}</dl>
              <p>Ao continuar, o WhatsApp abrirá com este resumo. Revise a mensagem e toque em enviar para compartilhá-la com Vinicius.</p>
              <div className="quiz-actions"><button type="button" className="text-button" onClick={back}>Editar respostas</button><WhatsAppLink className="button button-red" messageUrl={resultUrl}>Enviar pelo WhatsApp</WhatsAppLink></div>
            </div>
          )}
          <p className="quiz-note">Este quiz organiza sua conversa. Não é simulação, proposta comercial ou garantia de contemplação.</p>
        </div>
      </div>
    </section>
  )
}

function App() {
  const pageRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showFloatingCta, setShowFloatingCta] = useState(false)
  const [quizOpen, registerQuizOpen] = useState(() => () => {})

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const quietSections = [document.getElementById('inicio'), document.getElementById('quiz'), document.querySelector('.final-cta'), document.querySelector('.footer')].filter(Boolean)
    const visible = new Map(quietSections.map((section) => [section, false]))
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visible.set(entry.target, entry.isIntersecting))
      setShowFloatingCta(![...visible.values()].some(Boolean))
    }, { threshold: 0.05 })
    quietSections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const context = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
      intro.from('.site-header', { y: -24, autoAlpha: 0, duration: 0.8 })
        .from('.hero-eyebrow', { y: 18, autoAlpha: 0, duration: 0.65 }, '-=0.4')
        .from('.hero-title .line-inner', { yPercent: 110, rotation: 3, duration: 1.05, stagger: 0.12 }, '-=0.35')
        .from('.hero-bottom > *', { y: 26, autoAlpha: 0, duration: 0.75, stagger: 0.14 }, '-=0.45')
      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.from(element, { y: 46, autoAlpha: 0, duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } })
      })
      gsap.from('.portrait-frame img', { scale: 1.12, duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: '.portrait-frame', start: 'top 82%', once: true } })
    }, pageRef)
    return () => context.revert()
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const startQuiz = (category) => { closeMenu(); quizOpen(category) }

  return (
    <div ref={pageRef}>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Vinicius Beccari, voltar ao início" onClick={closeMenu}>
          <img src="/ademicon-mark.jpeg" width="52" height="52" alt="" />
          <span><strong>VINICIUS<br />BECCARI</strong><small>ADEMICON CONSÓRCIO</small></span>
        </a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen((open) => !open)}><span /><span /></button>
        <nav id="primary-nav" className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegação principal">
          <a href="#possibilidades" onClick={closeMenu}>Possibilidades</a>
          <a href="#como-funciona" onClick={closeMenu}>Como funciona</a>
          <a href="#sobre" onClick={closeMenu}>Sobre</a>
          <a href="#duvidas" onClick={closeMenu}>Dúvidas</a>
          <WhatsAppLink className="nav-contact">Falar no WhatsApp</WhatsAppLink>
        </nav>
      </header>

      <main id="conteudo">
        <section className="hero section-pad" id="inicio" aria-labelledby="hero-title">
          <div className="hero-eyebrow"><span className="eyebrow-dot" /> ADEMICON CONSÓRCIO <span className="eyebrow-separator">/</span> FLORIANÓPOLIS E TODO O BRASIL</div>
          <h1 className="hero-title" id="hero-title"><span className="line"><span className="line-inner">CONSÓRCIO</span></span><span className="line line-offset"><span className="line-inner">PARA O SEU</span></span><span className="line line-final"><span className="line-inner accent">PRÓXIMO <span className="mobile-word">PASSO<span className="period">.</span></span></span></span></h1>
          <div className="hero-bottom">
            <div className="hero-counter">01 <span>/</span> 07<br /><small>VINICIUS BECCARI × ADEMICON</small></div>
            <div className="hero-summary"><p>Quer comprar um imóvel, trocar de veículo ou realizar um projeto? Conheça as possibilidades de consórcio e fale diretamente com Vinicius sobre o seu plano.</p><div className="hero-actions"><WhatsAppLink className="button button-red hero-primary">Falar com Vinicius no WhatsApp</WhatsAppLink><button type="button" className="underlined-link" onClick={() => startQuiz()}>Responder 4 perguntas <Arrow /></button></div><span className="hero-action-note">CONVERSA DIRETA · SEM FORMULÁRIO LONGO</span></div>
          </div>
          <a className="scroll-cue" href="#possibilidades">EXPLORE A PÁGINA <span aria-hidden="true">↓</span></a>
        </section>

        <aside className="trust-bar section-pad" aria-label="Informações sobre a Ademicon e o atendimento">
          <div><strong>ADMINISTRADORA AUTORIZADA</strong><small>Pelo Banco Central do Brasil</small></div>
          <div><strong>TRÊS CAMINHOS PARA PLANEJAR</strong><small>Imóveis · Veículos · Serviços</small></div>
          <div><strong>ATENDIMENTO DIRETO</strong><small>Florianópolis e todo o Brasil</small></div>
        </aside>

        <section className="possibilities section-pad" id="possibilidades" aria-labelledby="possibilities-title">
          <div className="section-topline" data-reveal><span>02 / POSSIBILIDADES</span><span>UM PLANO PARA CADA OBJETIVO</span></div>
          <div className="section-heading-wrap" data-reveal><h2 id="possibilities-title">O que você quer <em>conquistar?</em></h2><p>Escolha o objetivo que está nos seus planos. Você pode explorar as possibilidades agora e tirar as dúvidas diretamente com Vinicius.</p></div>
          <div className="modality-list">{modalities.map((item) => <div className="modality-row" key={item.number} data-reveal><span className="row-number">{item.number} / 03</span><div><h3>{item.title}</h3><p>{item.description}</p></div><button type="button" aria-label={`Explorar consórcio de ${item.title.toLowerCase()}`} onClick={() => startQuiz(item.question)}><Arrow diagonal /></button></div>)}</div>
          <div className="section-outro" data-reveal><span>AINDA NÃO DECIDIU?</span><WhatsAppLink className="underlined-link">Converse sobre suas possibilidades</WhatsAppLink></div>
        </section>

        <Quiz registerOpen={registerQuizOpen} />

        <section className="process section-pad" id="como-funciona" aria-labelledby="process-title">
          <div className="section-topline" data-reveal><span>04 / ENTENDA O CAMINHO</span><span>SEM PRESSA. COM CLAREZA.</span></div>
          <div className="process-heading" data-reveal><h2 id="process-title">Um plano claro muda a forma de <em>começar.</em></h2><p>Você não precisa conhecer cada regra para iniciar a conversa. Entender as etapas ajuda a fazer as perguntas certas e decidir com mais segurança.</p></div>
          <div className="process-steps">
            <article data-reveal><span>01</span><h3>Defina seu objetivo</h3><p>Converse sobre o que quer conquistar, o valor de crédito desejado e uma parcela que caiba no seu planejamento.</p></article>
            <article data-reveal><span>02</span><h3>Participe do grupo</h3><p>Após escolher um plano e contratar uma cota, você contribui mensalmente e participa das assembleias do grupo.</p></article>
            <article data-reveal><span>03</span><h3>Acompanhe a contemplação</h3><p>A contemplação pode ocorrer por sorteio ou lance. Depois dela, o crédito pode ser usado conforme o contrato e as regras da administradora.</p></article>
          </div>
          <div className="process-note" data-reveal><span>TRANSPARÊNCIA IMPORTA</span><p>Consórcio não tem juros de financiamento, mas tem taxa de administração e pode ter outros custos previstos no contrato. Não existe data garantida de contemplação.</p></div>
          <div className="process-contact" data-reveal><p><strong>Quer entender como isso se aplica ao seu objetivo?</strong><span>Converse sobre as opções antes de escolher um plano.</span></p><WhatsAppLink className="button button-red">Tirar dúvidas no WhatsApp</WhatsAppLink></div>
        </section>

        <section className="about section-pad" id="sobre" aria-labelledby="about-title">
          <div className="section-topline" data-reveal><span>05 / QUEM VAI ATENDER VOCÊ</span><span>CONVERSA DIRETA</span></div>
          <div className="about-grid">
            <div className="about-copy" data-reveal><p className="about-kicker">PRAZER, SOU</p><h2 id="about-title">VINICIUS<br /><em>BECCARI.</em></h2><p>Uma decisão importante merece mais do que uma tabela de parcelas. Com Vinicius, a conversa começa pelo que você quer conquistar e pelas opções de consórcio que vale conhecer.</p><WhatsAppLink className="button button-red">Conversar com Vinicius</WhatsAppLink><span className="about-caption">FLORIANÓPOLIS, SANTA CATARINA — ATENDIMENTO EM TODO O BRASIL</span></div>
            <figure className="portrait-frame" data-reveal><img src="/vinicius-beccari.png" alt="Vinicius Beccari sentado à mesa, sorrindo" loading="lazy" width="611" height="611" /><figcaption>VINICIUS BECCARI <span>01 / 01</span></figcaption></figure>
          </div>
        </section>

        <section className="faq section-pad" id="duvidas" aria-labelledby="faq-title">
          <div className="section-topline" data-reveal><span>06 / PERGUNTAS FREQUENTES</span><span>O QUE VALE SABER</span></div>
          <div className="faq-grid"><div data-reveal><h2 id="faq-title">Antes de decidir, <em>pergunte.</em></h2><p>As respostas ajudam a começar. As condições do seu plano serão explicadas na conversa e no contrato.</p></div><div className="faq-list" data-reveal>{faqs.map((item, index) => <details key={item.question}><summary><span>{String(index + 1).padStart(2, '0')}</span>{item.question}<b aria-hidden="true">+</b></summary><p>{item.answer}</p></details>)}</div></div>
        </section>

        <section className="final-cta section-pad" aria-labelledby="final-title">
          <div className="section-topline" data-reveal><span>07 / PRÓXIMO PASSO</span><span>O COMEÇO DE UMA CONVERSA</span></div>
          <h2 id="final-title" data-reveal>Seu próximo passo começa <em>com uma conversa.</em></h2>
          <div className="final-bottom" data-reveal><p>Conte seu objetivo para Vinicius e tire as dúvidas sobre as possibilidades de consórcio. Seu plano pode começar com uma mensagem.</p><WhatsAppLink className="button button-light">Falar com Vinicius agora</WhatsAppLink></div>
        </section>
      </main>

      <footer className="footer section-pad"><div className="footer-main"><a className="footer-name" href="#inicio">VINICIUS<br />BECCARI<span>.</span></a><div><span>ADEMICON CONSÓRCIO</span><p>Florianópolis, SC<br />Atendimento em todo o Brasil</p></div><div><span>CONTATO</span><a href={directWhatsApp} target="_blank" rel="noopener noreferrer">WhatsApp <Arrow diagonal /></a><a href="https://www.instagram.com/viniciusbeccari.ademicon/" target="_blank" rel="noopener noreferrer">Instagram <Arrow diagonal /></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} VINICIUS BECCARI</span><span>CONSÓRCIO É PLANEJAMENTO. CONSULTE CONDIÇÕES CONTRATUAIS.</span><a href="#inicio">VOLTAR AO TOPO ↑</a></div></footer>
      {showFloatingCta && <WhatsAppLink className="floating-contact">Falar com Vinicius no WhatsApp</WhatsAppLink>}
    </div>
  )
}

export default App
