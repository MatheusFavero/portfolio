document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = document.body.scrollWidth;
        canvas.height = document.body.scrollHeight;
    }

    resizeCanvas();

    const stars = [];
    const numStars = 300; // Número de estrelas

    const mouse = {
        x: null,
        y: null,
        radius: 100
    };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    

    window.addEventListener("resize", () => {
        resizeCanvas();
    });

    class Star {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 1.5 + .5;
            this.dx = (Math.random() - 0.5) * 0.5;
            this.dy = (Math.random() - 0.5) * 0.5;
        }

        draw(ctx) {
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 2);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)');
            gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle || 0); // você pode animar isso depois
            ctx.beginPath();
        
            const len = this.radius * 2;
        
            // Linha horizontal
            ctx.moveTo(-len, 0);
            ctx.lineTo(len, 0);
            // Linha vertical
            ctx.moveTo(0, -len);
            ctx.lineTo(0, len);
        
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.restore();
        }
        
        
        
        update() {
            this.x += this.dx;
            this.y += this.dy;

            if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.dy *= -1;

            this.draw(ctx);
        }
    }

    function initStars() {
        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }
    }

    function connectStars() {
        for (let i = 0; i < stars.length; i++) {
            const a = stars[i];
            const dx = mouse.x - a.x;
            const dy = mouse.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = "rgba(255,255,255," + (1 - dist / mouse.radius) + ")";
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach((star) => star.update());
        connectStars();
        requestAnimationFrame(animate);
    }

    initStars();
    animate();
});
